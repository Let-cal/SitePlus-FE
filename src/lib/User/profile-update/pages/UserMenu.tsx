import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Mail, PenSquare, Settings, Shield, User } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../services/AuthContext";
import { EditProfileDialog } from "../components/EditProfileDialog";

export default function UserMenu() {
  const { userEmail, userRole, handleLogout, userName, userId } = useAuth();
  const [key, setKey] = React.useState(0);

  const handleProfileUpdate = () => {
    setKey((prev) => prev + 1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu key={key}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={userName || "User"} />
            <AvatarFallback className="bg-orange-100 text-orange-700">
              {getInitials(userName || "User")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-3 p-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={userName || "User"} />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-xl">
                {getInitials(userName || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-semibold">{userName || "User"}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0"
          >
            <EditProfileDialog
              initialName={userName || ""}
              initialEmail={userEmail || ""}
              userId={userId}
              onProfileUpdate={handleProfileUpdate}
              asTrigger={true}
            >
              <div className="flex items-center px-2 py-2 gap-2 hover:bg-slate-100 rounded-md w-full transition-colors">
                <PenSquare className="mr-2 h-4 w-4 text-blue-500" />
                <span>Edit Profile</span>
              </div>
            </EditProfileDialog>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center cursor-pointer hover:bg-slate-100 rounded-md transition-colors"
            >
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              Settings
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center cursor-pointer hover:bg-red-50 rounded-md text-red-600 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
