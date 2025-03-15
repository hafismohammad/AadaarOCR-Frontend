import axiosUrl from "../utils/axios";
import { AxiosResponse } from "axios";

export interface AadhaarDetails {
  name?: string;
  aadharNumber?: string;
  dob?: string;
  gender?: string;
  pin?: string;
  age?: string;
  address?: string;
  [key: string]: string | undefined; 
}

export const parseData = (formData: FormData): Promise<AxiosResponse<AadhaarDetails>> => {
  return axiosUrl.post<AadhaarDetails>("/parseData", formData);
};