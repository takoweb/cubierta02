import React from "react";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = "読み込み中..." }: LoadingProps) => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
