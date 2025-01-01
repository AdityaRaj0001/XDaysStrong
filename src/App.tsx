import Lottie from "lottie-react";
import animationData from "../public/Flame.json";
import animationData2 from "../public/Animal.json"; // Import the new animation
import { Button } from "./components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [streakStrength, setstreakStrength] = useState(() => {
    const storedStreakStrength = localStorage.getItem("streakStrength");
    return storedStreakStrength ? parseInt(storedStreakStrength, 10) : 20;
  });

  const [streakDays, setstreakDays] = useState(() => {
    const storedStreakDays = localStorage.getItem("streakDays");
    return storedStreakDays ? parseInt(storedStreakDays, 10) : 0;
  });

  const [lastRetainedDate, setLastRetainedDate] = useState(() => {
    const storedLastRetainedDate = localStorage.getItem("lastRetainedDate");
    return storedLastRetainedDate ? new Date(storedLastRetainedDate) : null;
  });
  const { toast } = useToast();

  // Load streak data from localStorage

  // Save streak data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("streakDays", streakDays.toString());
    localStorage.setItem("streakStrength", streakStrength.toString());
    localStorage.setItem(
      "lastRetainedDate",
      lastRetainedDate ? lastRetainedDate.toISOString() : ""
    );
  }, [streakDays, streakStrength, lastRetainedDate]);

  // Check if a day has passed since the last streak retain
  useEffect(() => {
    const checkStreak = () => {
      if (lastRetainedDate) {
        const today = new Date();
        const timeDiff = today.getTime() - lastRetainedDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays > 1) {
          // Reset streak if more than a day has passed
          setstreakDays(0);
          setstreakStrength(20); // Reset streakStrength as well
          setLastRetainedDate(null);
          toast({
            title: "Streak Lost! 😔",
          });
        }
      }
    };
    checkStreak(); // Call it immediately
    const interval = setInterval(checkStreak, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, [lastRetainedDate, toast]);

  const handleRetainStreak = () => {
    const today = new Date();
    if (!lastRetainedDate || today.getDate() !== lastRetainedDate.getDate()) {
      console.log("Streak Retained");
      setstreakStrength(streakStrength + 5);
      setstreakDays(streakDays + 1);
      setLastRetainedDate(today);
      toast({
        title: "Streak Retained!",
      });
    } else {
      toast({
        title: "Come back tmmrrw!",
      });
    }
  };

  const scale = 1.0 + (streakStrength / 5) * 0.02;
  const motivationMessages: { [key: string]: string } = {
    0: "Let's start strong today!",
    1: "Great start! Keep going!",
    2: "You're on fire! 🔥",
    3: "Three days and counting! 💪",
    5: "Halfway to 10 days! 🚀",
    10: "Double digits! Incredible! 🎉",
    default: "I GOT YOU!",
  };

  return (
    <div className="bg-black h-screen w-screen overflow-hidden max-w-xl mx-auto flex flex-col items-center justify-center">
      <Toaster />
      <h1 className="text-white text-lg px-2 text-center lg:text-2xl absolute top-4 titleFont">
        {streakDays} {streakDays > 1 ? "Days" : "Day"} Strong.{" "}
        <br></br>
        {motivationMessages[streakDays] || motivationMessages.default}
      </h1>

      {streakDays > 0 ? (
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ width: "20%", transform: `scale(${scale})` }}
          className="relative bottom-12"
        />
      ) : (
        <Lottie
        animationData={animationData2}
        loop={true}
        style={{ width: "50%", transform: `scale(${scale})` }}
        className="relative bottom-12"
      />
      )}
      <Button
        onClick={handleRetainStreak}
        className="bg-black border-2 border-red-400 absolute bottom-4 text-white p-2 rounded-lg"
      >
        I'm Here! 🚀
      </Button>
    </div>
  );
}

export default App;
