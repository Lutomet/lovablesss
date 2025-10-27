import { Account } from "./Dashboard";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Power,
  Trash2,
  MessageSquare,
  Clock,
  Hash,
  Server,
  Mail,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { AccountDetailsDialog } from "./AccountDetailsDialog";

interface AccountCardProps {
  account: Account;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const AccountCard = ({ account, onToggle, onRemove }: AccountCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isOnline = account.active && account.tokenValid;
  const statusColor = isOnline ? "bg-success" : account.tokenValid ? "bg-muted" : "bg-destructive";
  const statusText = isOnline ? "Online" : account.tokenValid ? "Paused" : "Invalid Token";
  const ringColor = isOnline ? "ring-success/30" : account.tokenValid ? "ring-muted/30" : "ring-destructive/30";

  const formatLastSent = (date?: string) => {
    if (!date) return "Never";
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <Card
        className="group hover:shadow-glow transition-all duration-300 cursor-pointer bg-gradient-card border-border overflow-hidden"
        onClick={() => setDetailsOpen(true)}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={account.avatarUrl || `https://cdn.discordapp.com/embed/avatars/0.png`}
                  alt={account.username}
                  className={`w-12 h-12 rounded-full ring-4 ${ringColor}`}
                />
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${statusColor} ring-2 ring-background`}></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{account.username}</h3>
                <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                  {statusText}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Channels:</span>
              <span className="font-medium">{account.channels}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Interval:</span>
              <span className="font-medium">{account.interval}s</span>
            </div>

            {account.guildChannel && (
              <div className="flex items-center gap-2 text-sm">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Server:</span>
                <span className="font-medium truncate">
                  #{account.guildChannel.channelName}
                </span>
              </div>
            )}

            {account.dmReply && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">DM Auto-Reply:</span>
                <span className="text-success font-medium">Enabled</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Messages:</span>
              <span className="font-medium">{account.messagesSent.toLocaleString()}</span>
            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground line-clamp-2">
                {account.message}
              </p>
            </div>
          </div>

          {/* Last Sent */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span>Last sent: {formatLastSent(account.lastSent)}</span>
            {!account.tokenValid && (
              <div className="flex items-center gap-1 text-destructive">
                <AlertCircle className="w-3 h-3" />
                <span>Invalid</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant={isOnline ? "outline" : "default"}
              size="sm"
              onClick={() => onToggle(account.id)}
              disabled={!account.tokenValid}
              className="flex-1 gap-2"
            >
              <Power className="w-4 h-4" />
              {account.active ? "Pause" : "Start"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(account.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AccountDetailsDialog
        account={account}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};
