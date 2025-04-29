
import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import DynamicForm from "@/components/DynamicForm";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ rollNumber: string; name: string } | null>(null);

  const handleLoginSuccess = (rollNumber: string, name: string) => {
    setUserData({ rollNumber, name });
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        userData && <DynamicForm rollNumber={userData.rollNumber} userName={userData.name} />
      )}
    </div>
  );
};

export default Index;
