import { useState, useEffect } from "react";
import { AccountCard } from "./AccountCard";
import { AddAccountDialog } from "./AddAccountDialog";
import { StatsPanel } from "./StatsPanel";
import { TrialBanner } from "./TrialBanner";
import { Button } from "./ui/button";
import { Plus, Settings, TrendingUp, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Account {
  id: string;
  username: string;
  avatarUrl?: string;
  active: boolean;
  tokenValid: boolean;
  channels: number;
  interval: number;
  message: string;
  guildChannel?: {
    guildId: string;
    channelName: string;
  };
  dmReply?: string;
  lastSent?: string;
  messagesSent: number;
}

export const Dashboard = () => {
  const { signOut } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch accounts
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((acc: any) => ({
        id: acc.id,
        username: acc.username,
        avatarUrl: acc.avatar_url,
        active: acc.active,
        tokenValid: acc.token_valid,
        channels: acc.channel_ids?.length || 0,
        interval: acc.interval,
        message: acc.message,
        guildChannel: acc.guild_id
          ? {
              guildId: acc.guild_id,
              channelName: acc.channel_name,
            }
          : undefined,
        dmReply: acc.dm_reply,
        lastSent: acc.last_sent,
        messagesSent: acc.messages_sent || 0,
      }));
    },
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-stats");
      if (error) throw error;
      return data;
    },
  });

  const toggleAccount = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.functions.invoke("manage-accounts", {
        body: { action: "toggle", accountId: id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update account");
    },
  });

  const removeAccount = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.functions.invoke("manage-accounts", {
        body: { action: "delete", accountId: id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account removed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove account");
    },
  });

  const totalMessages = stats?.accounts?.totalMessages || 0;
  const activeAccounts = stats?.accounts?.active || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Discord Bot Manager
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your automated messaging accounts
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowStats(!showStats)}
                className="gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Statistics
              </Button>
              <Button
                size="lg"
                onClick={() => setAddDialogOpen(true)}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                Add Account
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-card rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Accounts</p>
                  <p className="text-3xl font-bold">{accounts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-success animate-glow"></div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Active Now</p>
                  <p className="text-3xl font-bold text-success">{activeAccounts}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Messages</p>
                  <p className="text-3xl font-bold">{totalMessages.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TrialBanner />

        {showStats && <StatsPanel accounts={accounts} stats={stats?.stats} />}

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccountCard
                account={account}
                onToggle={() => toggleAccount.mutate(account.id)}
                onRemove={() => removeAccount.mutate(account.id)}
              />
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Accounts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first automation account
            </p>
            <Button
              size="lg"
              onClick={() => setAddDialogOpen(true)}
              className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add Your First Account
            </Button>
          </div>
        )}
      </div>

      <AddAccountDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        }}
      />
    </div>
  );
};
