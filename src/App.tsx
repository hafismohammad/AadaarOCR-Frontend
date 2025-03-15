import { useState } from "react";
import { useFormik } from "formik";
import ImageInput from "./components/ImageInputs";
import * as Yup from "yup";
import { Toaster, toast } from "sonner";
import { parseData } from "./service/axiosService";

// Type for Aadhaar details
interface AadhaarDetails {
  name?: string;
  aadharNumber?: string;
  dob?: string;
  gender?: string;
  pin?: string;
  age?: string;
  address?: string;
}

// Type for form values
interface FormValues {
  frontImage: File | null;
  backImage: File | null;
}

function App() {
  const [aadhaarDetails, setAadhaarDetails] = useState<AadhaarDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      frontImage: null,
      backImage: null,
    },
    validationSchema: Yup.object({
      frontImage: Yup.mixed<File>()
        .required("Front Image is required")
        .test(
          "fileSize",
          "File size is too large",
          (value) => value && value.size <= 2 * 1024 * 1024
        )
        .test(
          "fileType",
          "Invalid file type",
          (value) =>
            value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        ),

      backImage: Yup.mixed<File>()
        .required("Back Image is required")
        .test(
          "fileSize",
          "File size is too large",
          (value) => value && value.size <= 2 * 1024 * 1024
        )
        .test(
          "fileType",
          "Invalid file type",
          (value) =>
            value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        ),
    }),
    onSubmit: async (values) => {
      setAadhaarDetails(null);
      const formData = new FormData();

      if (values.frontImage) {
        formData.append("frontImage", values.frontImage);
      }
      if (values.backImage) {
        formData.append("backImage", values.backImage);
      }

      try {
        setIsLoading(true);
        const response = await parseData(formData);
        console.log("aadhaarDetails", response.data);
        setAadhaarDetails(response.data);
      } catch (error) {
        console.error("Error parsing Aadhaar data:", error);
        toast.error("Failed to parse Aadhaar data. Please recheck the uploaded images.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />
      <div className="h-auto w-full flex">
        <form
          onSubmit={formik.handleSubmit}
          className="h-screen bg-gray-50 w-[35%] flex flex-col justify-center space-y-8 p-6"
        >
          <ImageInput
            label="Aadhaar Front Image"
            fieldName="frontImage"
            formik={formik}
            setImagePreview={(preview: string) =>
              formik.setFieldValue("frontImagePreview", preview)
            }
          />
          <ImageInput
            label="Aadhaar Back Image"
            fieldName="backImage"
            formik={formik}
            setImagePreview={(preview: string) =>
              formik.setFieldValue("backImagePreview", preview)
            }
          />
          <button
            type="submit"
            className="bg-blue-600 py-3 px-4 w-full rounded-lg text-white font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            Parse Aadhaar
          </button>
        </form>

        <div className="h-auto bg-gray-200 w-[65%] flex items-center">
          {isLoading ? (
            <div className="flex w-full h-[80%] justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <div className="w-full h-[80%] flex flex-col space-y-4 p-4">
              <div className="text-2xl font-bold text-gray-800">
                <h1>Parsed Details</h1>
              </div>
              <div className="grid grid-cols-2 grid-rows-3 gap-6">
                <div className="p-4 rounded-lg bg-white shadow-lg">
                  <label className="block text-gray-700 text-lg font-semibold">
                    Name
                  </label>
                  <p className="border-b-2 border-gray-400 pb-1">
                    {aadhaarDetails?.name || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-lg">
                  <label className="block text-gray-700 text-lg font-semibold">
                    Aadhaar Number
                  </label>
                  <p className="border-b-2 border-gray-400 pb-1">
                    {aadhaarDetails?.aadharNumber || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-lg">
                  <label className="block text-gray-700 text-lg font-semibold">
                    Date of Birth
                  </label>
                  <p className="border-b-2 border-gray-400 pb-1">
                    {aadhaarDetails?.dob || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-lg">
                  <label className="block text-gray-700 text-lg font-semibold">
                    Gender
                  </label>
                  <p className="border-b-2 border-gray-400 pb-1">
                    {aadhaarDetails?.gender || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-lg">
                  <label className="block text-gray-700 text-lg font-semibold">
                    Pincode
                  </label>
                  <p className="border-b-2 border-gray-400 pb-1">
                    {aadhaarDetails?.pin || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-lg">
                  <label className="block text-gray-700 text-lg font-semibold">
                    Age
                  </label>
                  <p className="border-b-2 border-gray-400 pb-1">
                    {aadhaarDetails?.age || "N/A"}
                  </p>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-white shadow-lg">
                <label className="block text-gray-700 text-lg font-semibold">
                  Address
                </label>
                <p className="border-b-2 border-gray-400 pb-1">
                  {aadhaarDetails?.address || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
