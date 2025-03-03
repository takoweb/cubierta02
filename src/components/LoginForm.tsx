import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, User } from "lucide-react";
import { login } from "../utils/auth";

interface LoginFormProps {
  onSuccess?: () => void;
  showIcons?: boolean;
  showHint?: boolean;
}

const LoginForm = ({
  onSuccess = () => {},
  showIcons = false,
  showHint = true,
}: LoginFormProps) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!credentials.username || !credentials.password) {
      setError("ユーザー名とパスワードの両方を入力してください");
      return;
    }

    const success = await login(credentials.username, credentials.password);
    if (success) {
      setError("");
      onSuccess();
    } else {
      setError("認証情報が無効です。stefano/admin6044 をお試しください");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">ユーザー名</Label>
        {showIcons ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  username: e.target.value,
                })
              }
              placeholder="ユーザー名を入力してください"
              className="pl-10"
            />
          </div>
        ) : (
          <Input
            id="username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                username: e.target.value,
              })
            }
            placeholder="ユーザー名を入力してください"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">パスワード</Label>
        {showIcons ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-gray-400" />
            </div>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
              placeholder="パスワードを入力してください"
              className="pl-10"
            />
          </div>
        ) : (
          <Input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password: e.target.value,
              })
            }
            placeholder="パスワードを入力してください"
          />
        )}
      </div>

      <Button type="submit" className="w-full">
        ログイン
      </Button>

      {showHint && (
        <div className="text-xs text-center text-gray-500 pt-2">
          デモ用: stefano/admin6044 を使用してください
        </div>
      )}
    </form>
  );
};

export default LoginForm;
