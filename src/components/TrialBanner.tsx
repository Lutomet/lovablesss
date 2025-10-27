import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Gift, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const TrialBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data, error } = await supabase
        .from("access_management")
        .select("*")
        .single();

      if (!error && data) {
        setHasAccess(true);
      }
    } catch (error) {
      console.error("Error checking access:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTrial = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("claim-trial");

      if (error) throw error;

      toast.success("Trial Claimed!", {
        description: data.message,
      });
      setDismissed(true);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    } catch (error: any) {
      console.error("Error claiming trial:", error);
      toast.error(error.message || "Failed to claim trial");
    } finally {
      setLoading(false);
    }
  };

  if (loading || dismissed || hasAccess) return null;

  return (
    <Alert className="mb-6 border-primary/50 bg-primary/10 animate-fade-in relative">
      <Gift className="h-5 w-5 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 pr-8">
          <p className="font-semibold text-primary mb-1">
            🎁 Claim Your Free 24-Hour Trial!
          </p>
          <p className="text-sm text-muted-foreground">
            Get instant access to test automation features with 1 account for free.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleClaimTrial}
            disabled={loading}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {loading ? "Claiming..." : "Claim Trial"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
