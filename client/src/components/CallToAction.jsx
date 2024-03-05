import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div
      className="flex flex-col sm:flex-row p-3 border border-teal-500
    justify-center items-center rounded-tl-3xl rounded-br-3xl text-center"
    >
      <div className="flex-1  justify-center flex flex-col">
        <h2 className="text-2xl">want to learn more about mern</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with JavaScript project
        </p>
        <Button
          gradientDuoTone="purpleToBlue"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a href="#" target="_blank">
            Mern Stack
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://www.boardinfinity.com/blog/content/images/2023/01/Mern.png"
          alt="mern-image"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
