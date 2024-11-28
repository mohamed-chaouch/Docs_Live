"use client";

import { RegistrationSchema } from "@/Schema/RegistrationSchema";
import { registrationFormData } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signUp } from "@/services/signUp";
import { logIn } from "@/services/logIn";

export function usePopUpRegistration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [typeValue, setTypeValue] = useState("Sign Up");

  const handleChangeTypeValue = async (value: string) => {
    setTypeValue(value);
  };

  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        !["image/jpeg", "image/png", "image/jpg", "image/avif"].includes(
          file.type
        )
      ) {
        console.error(
          "Seuls les fichiers JPEG, JPG, AVIF et PNG sont autorisés."
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        console.error("Le fichier doit être inférieur à 5MB.");
        return;
      }

      setImageUrl(URL.createObjectURL(file)); // Preview
      setImage(file);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const router = useRouter();
  const submitInformation = async (data: registrationFormData) => {

    const fd = new FormData();
    fd.append("firstName", data.firstName);
    fd.append("lastName", data.lastName);
    fd.append("email", data.email);
    fd.append("password", data.password);
    if (image) {
        fd.append("imageUrl", image);
      }

    if(typeValue === "Sign Up"){
        await signUp(fd);
    setTimeout(() => {
      router.push("/home");
    }, 100);
    }else if(typeValue === "Sign In"){
        await logIn(data.email, data.password);
        setTimeout(() => {
          router.push("/home");
        }, 100);

    }
  };

  return {
    imageUrl, setImageUrl, setImage, handleClick, handleImageChange, inputRef,
    typeValue,
    handleChangeTypeValue,
    showPassword,
    handleClickShowPassword,
    register, handleSubmit, errors,
    submitInformation,
  };
}
