
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, CheckSquare, 
  Gift, BarChart2, Settings, LogOut 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">SoundTrump Admin</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Users
              </NavLink>
              <NavLink 
                to="/admin/tasks" 
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <CheckSquare className="mr-3 h-5 w-5" />
                Tasks
              </NavLink>
              <NavLink 
                to="/admin/rewards" 
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Gift className="mr-3 h-5 w-5" />
                Rewards
              </NavLink>
              <NavLink 
                to="/admin/statistics" 
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <BarChart2 className="mr-3 h-5 w-5" />
                Statistics
              </NavLink>
              <NavLink 
                to="/admin/settings" 
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </NavLink>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <Button 
              variant="ghost" 
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold">SoundTrump Admin</h1>
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
