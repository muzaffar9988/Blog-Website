import CallToAction from "../components/CallToAction";

export default function Project() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-md text-gray-500">
        Build fun and engaging projects while learning MongoDB,ExpressJS,ReactJs
        & NodeJS
      </p>
      <CallToAction />
    </div>
  );
}
