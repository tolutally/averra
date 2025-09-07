import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async ({ file, stepId, token, onProgress }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('stepId', stepId);
      formData.append('token', token);

      // Emit upload start event
      dispatch(setUploadProgress({ fileId: file.name, progress: 0, status: 'uploading' }));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Emit upload success
      dispatch(setUploadProgress({ fileId: file.name, progress: 100, status: 'success' }));
      
      return result;
    } catch (error) {
      // Emit upload fail
      dispatch(setUploadProgress({ fileId: file.name, progress: 0, status: 'error', error: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

export const validateFile = createAsyncThunk(
  'upload/validateFile',
  async ({ file, rules }, { rejectWithValue }) => {
    try {
      // Client-side validation
      const errors = [];
      
      // File type validation
      if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
      }
      
      // File size validation
      if (rules.maxSize && file.size > rules.maxSize) {
        errors.push(`File size exceeds ${rules.maxSize} bytes`);
      }
      
      // Filename validation
      if (rules.filenamePattern && !rules.filenamePattern.test(file.name)) {
        errors.push('Invalid filename format');
      }

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      return { valid: true, file };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scanFile = createAsyncThunk(
  'upload/scanFile',
  async ({ fileId, hash }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/upload/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, hash }),
      });

      if (!response.ok) {
        throw new Error('File scan failed');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  uploads: {},
  currentUpload: null,
  loading: false,
  error: null,
  validationErrors: {},
  uploadProgress: {},
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      const { fileId, progress, status, error } = action.payload;
      state.uploadProgress[fileId] = {
        progress,
        status,
        error,
        timestamp: Date.now(),
      };
    },
    clearUploadProgress: (state, action) => {
      const fileId = action.payload;
      delete state.uploadProgress[fileId];
    },
    setValidationError: (state, action) => {
      const { fileId, error } = action.payload;
      state.validationErrors[fileId] = error;
    },
    clearValidationError: (state, action) => {
      const fileId = action.payload;
      delete state.validationErrors[fileId];
    },
    clearAllValidationErrors: (state) => {
      state.validationErrors = {};
    },
    addUpload: (state, action) => {
      const upload = action.payload;
      state.uploads[upload.id] = upload;
    },
    updateUpload: (state, action) => {
      const { uploadId, updates } = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId] = { ...state.uploads[uploadId], ...updates };
      }
    },
    removeUpload: (state, action) => {
      const uploadId = action.payload;
      delete state.uploads[uploadId];
    },
    setCurrentUpload: (state, action) => {
      state.currentUpload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        const upload = action.payload;
        state.uploads[upload.id] = upload;
        state.currentUpload = upload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Validate file
      .addCase(validateFile.fulfilled, (state, action) => {
        const { file } = action.payload;
        delete state.validationErrors[file.name];
      })
      .addCase(validateFile.rejected, (state, action) => {
        const fileName = action.meta.arg.file.name;
        state.validationErrors[fileName] = action.payload;
      })
      // Scan file
      .addCase(scanFile.fulfilled, (state, action) => {
        const { fileId, scanResult } = action.payload;
        if (state.uploads[fileId]) {
          state.uploads[fileId].scanResult = scanResult;
          state.uploads[fileId].status = scanResult.clean ? 'scanned' : 'blocked';
        }
      })
      .addCase(scanFile.rejected, (state, action) => {
        const { fileId } = action.meta.arg;
        if (state.uploads[fileId]) {
          state.uploads[fileId].status = 'scan_failed';
          state.uploads[fileId].error = action.payload;
        }
      });
  },
});

export const {
  clearError,
  setUploadProgress,
  clearUploadProgress,
  setValidationError,
  clearValidationError,
  clearAllValidationErrors,
  addUpload,
  updateUpload,
  removeUpload,
  setCurrentUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
