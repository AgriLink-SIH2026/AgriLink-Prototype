import React, { useState } from 'react';
import { captureCurrentGpsPosition, GeoPositionResult, GeolocationErrorResult } from '../../services/geolocation';
import { MapPin, Camera, CheckCircle2, AlertTriangle, RefreshCw, Upload } from 'lucide-react';

interface GeotagUploadProps {
  onLocationCaptured: (pos: GeoPositionResult) => void;
  onImageSelected: (base64OrUrl: string) => void;
  currentLocation: GeoPositionResult | null;
  currentImage: string | null;
}

export const GeotagUpload: React.FC<GeotagUploadProps> = ({
  onLocationCaptured,
  onImageSelected,
  currentLocation,
  currentImage,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleCaptureGps = async () => {
    setIsLocating(true);
    setGeoError(null);
    try {
      const pos = await captureCurrentGpsPosition();
      onLocationCaptured(pos);
    } catch (err) {
      const error = err as GeolocationErrorResult;
      if (error.isPermissionDenied) {
        setGeoError(
          'Location permission was denied. Geotagging is required by government & factory procurement guidelines for crop field verification. Please allow location access in your browser settings and click Retry.'
        );
      } else {
        setGeoError(error.message || 'Failed to capture GPS position. Please ensure GPS is enabled.');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read as Base64 data URL for local persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageSelected(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 bg-[#F3EFE4] p-5 rounded-3xl border border-[#DFD7C4]">
      <div>
        <h4 className="text-sm font-serif font-bold text-[#173522] flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#D97824]" />
          <span>Geotagged Field Evidence (Mandatory)</span>
        </h4>
        <p className="text-xs font-sans text-[#777268] mt-0.5">
          Government SIH guidelines require genuine GPS coordinates and photographs taken at the crop field.
        </p>
      </div>

      {/* GPS Capture Step */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#DFD7C4]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#173522]" />
              <span className="text-xs font-bold text-[#173522] font-sans">Step 1: Capture Field GPS</span>
            </div>
            {currentLocation ? (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#173522] bg-[#F3EFE4] border border-[#DFD7C4] px-2.5 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#173522]" />
                  Location Captured ✓
                </span>
                <span className="text-xs font-mono text-[#173522]">
                  {currentLocation.latitude}° N, {currentLocation.longitude}° E
                </span>
                <span className="text-[11px] text-[#777268] font-mono">
                  (&plusmn;{currentLocation.accuracy}m)
                </span>
              </div>
            ) : (
              <p className="text-xs font-sans text-[#777268] mt-1">
                Click button to capture current field latitude &amp; longitude.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleCaptureGps}
            disabled={isLocating}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shrink-0 cursor-pointer ${
              currentLocation
                ? 'bg-[#F3EFE4] hover:bg-[#EBE5D6] text-[#173522] border border-[#DFD7C4]'
                : 'bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] shadow-sm'
            }`}
          >
            {isLocating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D97824]" />
                <span>Locating GPS...</span>
              </>
            ) : currentLocation ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recapture GPS</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-[#D97824]" />
                <span>Capture GPS Location</span>
              </>
            )}
          </button>
        </div>

        {/* Permission Denied / Error Warning */}
        {geoError && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">GPS Permission Required</p>
              <p className="mt-0.5 leading-relaxed">{geoError}</p>
              <button
                type="button"
                onClick={handleCaptureGps}
                className="mt-2 px-3 py-1 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" />
                Retry GPS Permission
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Step */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#DFD7C4]">
        <div className="flex items-center gap-1.5 mb-2">
          <Camera className="w-4 h-4 text-[#173522]" />
          <span className="text-xs font-bold text-[#173522] font-sans">Step 2: Upload Sown Crop Photograph</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <label className="border-2 border-dashed border-[#DFD7C4] hover:border-[#D97824] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#F3EFE4]/60 hover:bg-[#F3EFE4]">
            <Upload className="w-6 h-6 text-[#D97824] mb-1" />
            <span className="text-xs font-semibold text-[#173522]">Click to upload photo</span>
            <span className="text-[11px] text-[#777268] mt-0.5">JPEG, PNG or Camera capture</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Image Preview */}
          <div className="h-32 rounded-2xl overflow-hidden border border-[#DFD7C4] bg-[#F3EFE4] flex items-center justify-center relative">
            {currentImage ? (
              <>
                <img
                  src={currentImage}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-[#12281A]/85 text-[#F3EFE4] text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
                  Geotagged Photo
                </div>
              </>
            ) : (
              <span className="text-xs text-[#777268]">No crop image selected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
