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
    <section className="flex items-center justify-center gap-12 h-screen  bg-slate-100 flex-col relative">
      <div className="absolute top-14 ">
        <img className="h-[100px]" src={"./logoempresa.png"} />
      </div>
      {/* <div className="h-[300px] rounded-full absolute top-10 left-[300px] w-[300px] bg-indigo-700 shadow-lg"></div> */}
      <form
        onSubmit={onSubmit}
        className="flex w-1/4 flex-col gap-4 bg-slate-300 px-10 py-10 rounded-lg shadow-md shadow-gray-500/40"
      >
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
        <div>
          <Button type={"submit"} titulo={"Iniciar Sesión"} />
        </div>
      </form>

      <svg
        className="absolute bottom-[-150px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#6366F1"
          fill-opacity="1"
          d="M0,192L48,170.7C96,149,192,107,288,85.3C384,64,480,64,576,90.7C672,117,768,171,864,170.7C960,171,1056,117,1152,80C1248,43,1344,21,1392,10.7L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};
