// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Label } from "../../components/formularios/Label";
import { Input } from "../../components/formularios/Input";
import { Button } from "../../components/formularios/Button";
import { InputPassword } from "../../components/formularios/InputPassword";

export const Login = () => {
  const { signin, error } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/");
    }
  });

  return (
    <section className="flex items-center justify-center gap-12 h-screen  bg-[rgb(243 244 246)] relative">
      {/* <div className="h-screen w-1/2 bg-gradient-to-tr to-indigo-500 from-orange-500 relative overflow-hidden"> */}
      <div
        className="w-2/3 inset-0 h-full"
        style={{
          clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
          animation: "changeColor 5s infinite alternate",
        }}
      ></div>
      {/* </div> */}
      <div className="w-1/2 px-12">
        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col gap-4 bg-white py-16 px-12 rounded-2xl shadow-xl shadow-gray-500/40 mx-auto"
        >
          <div className="font-semibold text-lg text-slate-600 flex flex-col gap-1 justify-center items-center text-center">
            <p>Bienvenido/a al sistema de contabilidad/empleados 👋</p>
            <p className="text-sm font-medium text-center">
              ¡Crea tus empleados y comprobantes ahora!
            </p>
          </div>
          {
            <div>
              <div className="flex flex-col gap-1">
                {error?.map((e) => (
                  <span className="bg-red-500/10 rounded-lg px-2 py-1 text-red-600 text-sm border-[1px] border-red-500/30">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          }
          <div className="flex flex-col gap-2">
            <Label label="Email del registro" />
            <Input
              // registro={{ ...register("email", { required: true }) }}
              register={register}
              placeholder={"emailregistro@email.com"}
              type={"email"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label label="Contraseña del registro" />
            <InputPassword
              register={register}
              // registro={{ ...register("password", { required: true }) }}
              placeholder={""}
              type={"password"}
            />
          </div>
          <div className="flex mt-2">
            <Button type={"submit"} titulo={"Iniciar Sesión"} />
          </div>
        </form>
      </div>
    </section>
  );
};
