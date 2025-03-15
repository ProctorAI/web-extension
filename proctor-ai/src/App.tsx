import AuthForm from "@/components/ui/AuthForm"; // Import AuthForm
import { Toaster } from "sonner"; // Toast notifications

function App() {
  return (
    <div className="p-4 w-96">
      <Toaster position="top-center" />
      <AuthForm />
    </div>
  );
}

export default App;
