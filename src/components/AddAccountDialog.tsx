import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const accountSchema = z.object({
  token: z.string().min(1, "Token is required"),
  message: z.string().min(1, "Message is required").max(2000, "Message too long"),
  channels: z.string().min(1, "At least one channel is required"),
  interval: z.number().min(30, "Interval must be at least 30 seconds"),
  guildId: z.string().optional(),
  channelName: z.string().optional(),
  dmReply: z.string().max(2000, "DM reply too long").optional(),
});

export const AddAccountDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddAccountDialogProps) => {
  const [showWarning, setShowWarning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [discordUser, setDiscordUser] = useState<{ username: string; avatar: string } | null>(null);
  const [formData, setFormData] = useState({
    token: "",
    message: "",
    channels: "",
    interval: "60",
    guildId: "",
    channelName: "",
    dmReply: "",
  });

  const validateDiscordToken = async (token: string) => {
    if (!token.trim()) {
      setTokenValid(null);
      setDiscordUser(null);
      return;
    }

    setValidatingToken(true);
    try {
      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setTokenValid(true);
        setDiscordUser({
          username: `${user.username}#${user.discriminator !== '0' ? user.discriminator : user.username}`,
          avatar: user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`,
        });
        toast.success(`Token verified! Found: ${user.username}`);
      } else {
        setTokenValid(false);
        setDiscordUser(null);
        toast.error('Invalid Discord token');
      }
    } catch (error) {
      setTokenValid(false);
      setDiscordUser(null);
      toast.error('Failed to validate token');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenValid || !discordUser) {
      toast.error('Please validate your Discord token first');
      return;
    }

    const channelIds = formData.channels
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id)
      .map((id) => parseInt(id));

    // Validate input
    try {
      accountSchema.parse({
        token: formData.token,
        message: formData.message,
        channels: formData.channels,
        interval: parseInt(formData.interval),
        guildId: formData.guildId,
        channelName: formData.channelName,
        dmReply: formData.dmReply,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("manage-accounts", {
        body: {
          action: "create",
          accountData: {
            userToken: formData.token,
            username: discordUser.username,
            avatarUrl: discordUser.avatar,
            message: formData.message,
            channelIds,
            interval: parseInt(formData.interval),
            guildId: formData.guildId || null,
            channelName: formData.channelName || null,
            dmReply: formData.dmReply || null,
          },
        },
      });

      if (error) {
        // Extract error message from response body or error object
        const errorMsg = (data as any)?.error || error.message || "Failed to add account";
        
        if (errorMsg.toLowerCase().includes('trial') || errorMsg.toLowerCase().includes('access')) {
          toast.error("⚠️ Please claim your 24-hour trial first!");
        } else {
          toast.error(errorMsg);
        }
        return;
      }

      toast.success("Account added successfully!");
      setFormData({
        token: "",
        message: "",
        channels: "",
        interval: "60",
        guildId: "",
        channelName: "",
        dmReply: "",
      });
      setTokenValid(null);
      setDiscordUser(null);
      setShowWarning(true);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding account:", error);
      toast.error("Failed to add account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showWarning) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Security Warning
            </DialogTitle>
            <DialogDescription>
              Please read carefully before proceeding
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm space-y-2">
              <p className="font-semibold">
                Using user tokens is against Discord's Terms of Service!
              </p>
              <div className="mt-3">
                <p className="font-medium mb-1">Token Safety Precautions:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Minimum 30-second intervals enforced</li>
                  <li>Safety mode enabled by default</li>
                  <li>Rate limiting and progressive backoff</li>
                  <li>Limited channels per cycle</li>
                  <li>Enhanced error detection</li>
                </ul>
              </div>
              <div className="mt-3">
                <p className="font-medium">Risks:</p>
                <p className="text-xs">
                  Account termination, IP restrictions, token invalidation
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel - Too Risky
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowWarning(false)}
              className="flex-1"
            >
              I Understand - Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Account Configuration</DialogTitle>
          <DialogDescription>
            Configure your automation account settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">User Token *</Label>
            <div className="space-y-2">
              <Textarea
                id="token"
                placeholder="Your Discord account token"
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
                required
                className="font-mono text-sm"
                rows={3}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => validateDiscordToken(formData.token)}
                disabled={validatingToken || !formData.token.trim()}
                className="w-full"
              >
                {validatingToken ? "Validating..." : "Validate Token"}
              </Button>
              {tokenValid === true && discordUser && (
                <div className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded-md">
                  <img src={discordUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-success">{discordUser.username}</p>
                    <p className="text-xs text-muted-foreground">Token valid</p>
                  </div>
                </div>
              )}
              {tokenValid === false && (
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">Invalid token</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Send *</Label>
            <Textarea
              id="message"
              placeholder="Hello world!"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channels">Channel IDs (comma separated) *</Label>
            <Input
              id="channels"
              placeholder="123456789, 987654321"
              value={formData.channels}
              onChange={(e) =>
                setFormData({ ...formData, channels: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Interval (seconds) - MINIMUM 30 *</Label>
            <Input
              id="interval"
              type="number"
              min="30"
              placeholder="60"
              value={formData.interval}
              onChange={(e) =>
                setFormData({ ...formData, interval: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guildId">Server ID (Optional)</Label>
              <Input
                id="guildId"
                placeholder="123456789012345678"
                value={formData.guildId}
                onChange={(e) =>
                  setFormData({ ...formData, guildId: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name (Optional)</Label>
              <Input
                id="channelName"
                placeholder="general"
                value={formData.channelName}
                onChange={(e) =>
                  setFormData({ ...formData, channelName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dmReply">DM Auto-Reply Message (Optional)</Label>
            <Textarea
              id="dmReply"
              placeholder="Leave empty to disable DM auto-reply"
              value={formData.dmReply}
              onChange={(e) =>
                setFormData({ ...formData, dmReply: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setShowWarning(true);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
