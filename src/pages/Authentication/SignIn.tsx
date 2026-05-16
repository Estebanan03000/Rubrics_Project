import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";

import Breadcrumb from "../../components/Breadcrumb";
import SecurityService, { LoginCredentials } from "../../services/securityService";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await SecurityService.login(credentials);
      console.log("Usuario autenticado:", response);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      alert("No se pudo iniciar sesión con correo y contraseña.");
    }
  };

  const handleUnavailableSocialLogin = (provider: string) => {
    alert(
      `El inicio de sesión con ${provider} requiere soporte del backend. Actualmente el backend solo permite login con correo y contraseña.`
    );
  };

  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Rubrics Project
              </h2>

              <p className="2xl:px-20">
                Sistema académico para gestión de rúbricas, evaluaciones y
                calificaciones.
              </p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">
                Bienvenido de nuevo
              </span>

              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Iniciar sesión
              </h2>

              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Correo inválido")
                    .required("El correo es obligatorio"),
                  password: Yup.string().required(
                    "La contraseña es obligatoria"
                  ),
                })}
                onSubmit={(values) => {
                  handleLogin(values);
                }}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Email
                      </label>

                      <div className="relative">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Ingrese su correo"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />

                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-2 text-sm text-danger"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Password
                      </label>

                      <div className="relative">
                        <Field
                          type="password"
                          name="password"
                          placeholder="Ingrese su contraseña"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />

                        <ErrorMessage
                          name="password"
                          component="div"
                          className="mt-2 text-sm text-danger"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      >
                        Login
                      </button>
                    </div>

                    <div className="my-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
                      <span className="text-sm text-body dark:text-bodydark">
                        o ingresa con
                      </span>
                      <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => handleUnavailableSocialLogin("Google")}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white p-4 font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                      >
                        <FcGoogle className="text-2xl" />
                        Iniciar sesión con Google
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUnavailableSocialLogin("Microsoft")}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white p-4 font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                      >
                        <FaMicrosoft className="text-xl" />
                        Iniciar sesión con Microsoft
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUnavailableSocialLogin("GitHub")}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white p-4 font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                      >
                        <FaGithub className="text-2xl" />
                        Iniciar sesión con GitHub
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;