import { FormikProps } from "formik";
import { ChangeEvent, useRef, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";

interface ImageInputProps {
  label: string;
  fieldName: string;
  formik: FormikProps<any>;
  setImagePreview: (preview: string) => void;
}

const ImageInputs: React.FC<ImageInputProps> = ({ label, fieldName, formik, setImagePreview }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue(fieldName, file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      setImagePreview("");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-[230px] flex flex-col items-center">
      <div className="w-[75%] h-[30px]">
        <h1 className="text-lg font-semibold text-gray-800 tracking-wider">
          {label}
        </h1>
      </div>
      <div
        className="w-[75%] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
        onClick={handleClick}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Image Preview"
            className="object-cover w-full h-full rounded-md"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
            <IoMdCloudUpload className="text-6xl text-blue-500" />
            <p className="text-center text-xl font-semibold">
              Upload the image
            </p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <div className="text-red-600 text-sm">{formik.errors[fieldName] as string}</div>
      )}
    </div>
  );
};

export default ImageInputs;
