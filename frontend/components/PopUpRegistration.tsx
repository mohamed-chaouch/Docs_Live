"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { usePopUpRegistration } from "@/hooks/usePopUpRegistration";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import React from "react";

const PopUpRegistration = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    imageUrl,
    setImageUrl,
    setImage,
    handleClick,
    handleImageChange,
    inputRef,
    typeValue,
    handleChangeTypeValue,
    showPassword,
    handleClickShowPassword,
    SignUpRegister,
    SignInRegister,
    handleSignUpSubmit,
    handleSignInSubmit,
    signUpErrors,
    signInErrors,
    submitSignUp,
    submitSignIn,
  } = usePopUpRegistration();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:rounded-[10px] border-0 p-4 max-h-[90vh] overflow-auto rounded-[10px]">
        <DialogTitle></DialogTitle>
        <Tabs
          value={typeValue} // Synchronize the Tabs value with typeValue state
          onValueChange={handleChangeTypeValue}
          className="w-full text-center mt-4"
        >
          <TabsList className="bg-orange-1">
            <TabsTrigger
              value="Sign Up"
              className={cn(
                "px-12",
                typeValue === "Sign Up" ? "bg-orange-1" : "text-white"
              )}
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger
              value="Sign In"
              className={cn(
                "px-12",
                typeValue === "Sign In" ? "bg-orange-1" : "text-white"
              )}
            >
              Sign In
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DialogHeader>
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={
              typeValue === "Sign Up"
                ? handleSignUpSubmit(submitSignUp)
                : handleSignInSubmit(submitSignIn)
            }
          >
            {typeValue === "Sign Up" && (
              <>
                <div className="flex items-center justify-center rounded-[50%] bg-orange-1">
                  <div className="relative">
                    <input
                      type="file"
                      name="imageUrl"
                      ref={inputRef}
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <div
                      className={cn(
                        "w-[120px] h-[120px] cursor-pointer text-white  flex items-center justify-center",
                        {
                          "blur-[1px]": !imageUrl,
                        }
                      )}
                      onClick={handleClick}
                      style={{
                        background: imageUrl
                          ? `url(${imageUrl}) center/cover no-repeat`
                          : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {!imageUrl && <span className="blur-0">Pick image</span>}
                    </div>
                    {imageUrl && (
                      <span
                        style={{ fontSize: "16px" }}
                        className="absolute bottom-0 right-[5px] text-red-600 cursor-pointer"
                        onClick={() => {
                          setImageUrl(null);
                          setImage(undefined);
                        }}
                      >
                        <Trash2 />
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col md:flex-row items-center justify-center mt-2 gap-2 w-full">
                  <div className="w-full">
                    <p className="text-left font-semibold">First Name</p>
                    <input
                      {...SignUpRegister("firstName")}
                      placeholder="First Name"
                      type="text"
                      className="w-full p-2 text-black border border-black rounded shadow-2xl"
                    />
                    {signUpErrors.firstName && (
                      <p className="text-red-500 text-sm text-left">
                        {signUpErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <p className="text-left font-semibold">Last Name</p>
                    <input
                      {...SignUpRegister("lastName")}
                      placeholder="Last Name"
                      type="text"
                      className="w-full p-2 text-black border border-black rounded shadow-2xl"
                    />
                    {signUpErrors.lastName && (
                      <p className="text-red-500 text-sm text-left">
                        {signUpErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="my-2 w-full">
              <p className="text-left font-semibold">Email </p>
              <input
                {...(typeValue === "Sign Up"
                  ? SignUpRegister("email")
                  : SignInRegister("email"))}
                placeholder="test@gmail.com"
                type="email"
                className="w-full p-2 text-black border border-black rounded shadow-2xl"
              />
              {typeValue === "Sign Up" && signUpErrors.email && (
                <p className="text-red-500 text-sm text-left">
                  {signUpErrors.email.message}
                </p>
              )}
              {typeValue === "Sign In" && signInErrors.email && (
                <p className="text-red-500 text-sm text-left">
                  {signInErrors.email.message}
                </p>
              )}
            </div>
            <div className="mb-2 sm:mb-3 w-full">
              <p className="text-left font-semibold">Password</p>
              <div className="relative">
                <input
                  {...(typeValue === "Sign Up"
                    ? SignUpRegister("password")
                    : SignInRegister("password"))}
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  className="w-full p-2 text-black border border-black rounded shadow-2xl"
                />
                <button
                  onClick={handleClickShowPassword}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-gray-800" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-800" />
                  )}
                </button>
              </div>
              {typeValue === "Sign Up" && signUpErrors.password && (
                <p className="text-red-500 text-sm text-left">
                  {signUpErrors.password.message}
                </p>
              )}
              {typeValue === "Sign In" && signInErrors.password && (
                <p className="text-red-500 text-sm text-left">
                  {signInErrors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="flex items-center justify-center bg-orange-1 hover:bg-orange-2 text-white mt-4 p-2 rounded w-full"
            >
              {typeValue}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PopUpRegistration;
