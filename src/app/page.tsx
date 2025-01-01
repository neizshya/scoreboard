"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home() {
  return (
    <div className="container min-h-[88vh] md:min-h-screen  mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center gap-y-3 text-center">
      <p className="text-3xl md:text-4xl">Welcome To Scoreboard!</p>
      <p className="text-base">Compare your achievement with your friends</p>
      <DotLottieReact
        src="https://lottie.host/64196334-e323-4106-bb00-1af1ed422592/WcwJNFckEK.lottie"
        loop
        autoplay
      />
    </div>
  );
}
