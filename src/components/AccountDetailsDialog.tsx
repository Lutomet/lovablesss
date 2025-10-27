import { Account } from "./Dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface AccountDetailsDialogProps {
  account: Account;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountDetailsDialog = ({
  account,
  open,
  onOpenChange,
}: AccountDetailsDialogProps) => {
  const recentMessages = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000),
      channel: "123456789",
      success: true,
      message: account.message,
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3900000),
      channel: "987654321",
      success: true,
      message: account.message,
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 7500000),
      channel: "456789123",
      success: false,
      message: account.message,
      error: "Rate limit exceeded",
    },
  ];

  const errorLog = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 7500000),
      type: "Rate Limit",
      details: "HTTP 429 - Too Many Requests",
    },
  ];

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                account.active && account.tokenValid
                  ? "bg-success/20"
                  : "bg-muted/20"
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  account.active && account.tokenValid ? "bg-success" : "bg-muted"
                }`}
              ></div>
            </div>
            {account.username}
          </DialogTitle>
          <DialogDescription>Account details and activity log</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[600px] pr-4">
          <div className="space-y-6">
            {/* Configuration */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Configuration
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      account.active && account.tokenValid ? "default" : "secondary"
                    }
                  >
                    {account.active && account.tokenValid
                      ? "Online"
                      : account.tokenValid
                      ? "Paused"
                      : "Invalid Token"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channels:</span>
                  <span className="font-medium">{account.channels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interval:</span>
                  <span className="font-medium">{account.interval}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages Sent:</span>
                  <span className="font-medium">
                    {account.messagesSent.toLocaleString()}
                  </span>
                </div>
                {account.guildChannel && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server Channel:</span>
                    <span className="font-medium">
                      #{account.guildChannel.channelName}
                    </span>
                  </div>
                )}
                {account.dmReply && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DM Auto-Reply:</span>
                    <span className="text-success font-medium">Enabled</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="font-semibold mb-3">Message Content</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{account.message}</p>
              </div>
            </div>

            {/* Recent Messages */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Recent Messages
              </h3>
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-muted/30 rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {msg.success ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          Channel {msg.channel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {msg.message}
                    </p>
                    {msg.error && (
                      <p className="text-xs text-destructive mt-1">{msg.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Log */}
            {errorLog.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Error Log
                </h3>
                <div className="space-y-2">
                  {errorLog.map((error) => (
                    <div
                      key={error.id}
                      className="bg-destructive/10 rounded-lg p-3 border border-destructive/20"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-medium">{error.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(error.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{error.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
