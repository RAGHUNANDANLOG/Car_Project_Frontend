import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ 
  images = [], 
  existingImages = [],
  onImagesChange, 
  onRemoveImage,
  onRemoveExistingImage,
  onSetDefault,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  error
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    onImagesChange([...images, ...newImages]);
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - images.length - existingImages.length,
    maxSize,
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-electric-500 bg-electric-500/10'
            : error
            ? 'border-red-500/50 hover:border-red-400'
            : 'border-slate-700/50 hover:border-electric-500/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-electric-500/20 to-neon-pink/20 flex items-center justify-center">
            <span className="text-3xl">📸</span>
          </div>
          {isDragActive ? (
            <p className="text-electric-400 font-medium">Drop images here...</p>
          ) : (
            <>
              <p className="text-slate-300">
                <span className="text-electric-400 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-slate-500">
                PNG, JPG, GIF, WebP up to 5MB each (max {maxFiles} files)
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Existing Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  image.isDefault ? 'border-electric-500' : 'border-transparent'
                }`}>
                  <img
                    src={image.path}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {image.isDefault && (
                  <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-electric-500 text-white rounded-lg">
                    Default
                  </span>
                )}
                <div className="absolute inset-0 bg-midnight-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  {!image.isDefault && (
                    <button
                      type="button"
                      onClick={() => onSetDefault(image.id)}
                      className="p-2 bg-electric-500 rounded-lg text-white hover:bg-electric-400 transition-colors"
                      title="Set as default"
                    >
                      ⭐
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(image.id)}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-400 transition-colors"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">New Images to Upload</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-midnight-950 to-transparent">
                  <p className="text-xs text-slate-300 truncate">{image.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(image.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;



