import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPoll } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { UserSelector } from "@/components/UserSelector";
import { Plus, Trash2, Save, Rocket } from "lucide-react";

const createPollSchema = z.object({
  question: z.string().min(1, "Poll question is required"),
  isPublished: z.boolean().default(true),
  options: z.array(z.object({ text: z.string().min(1, "Option text is required") })).min(2, "At least 2 options are required"),
});

type CreatePollForm = z.infer<typeof createPollSchema>;

export default function CreatePoll() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const [showUserSelector, setShowUserSelector] = useState(!currentUser);

  const form = useForm<CreatePollForm>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
      isPublished: true,
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const createPollMutation = useMutation({
    mutationFn: (data: CreatePollForm) => {
      if (!currentUser) {
        throw new Error("Please select a user first");
      }
      return createPoll({
        ...data,
        userId: currentUser.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
      toast({
        title: "Success",
        description: "Poll created successfully!",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create poll",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreatePollForm) => {
    if (!currentUser) {
      setShowUserSelector(true);
      return;
    }
    createPollMutation.mutate(data);
  };

  const addOption = () => {
    append({ text: "" });
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <>
      <UserSelector open={showUserSelector} onClose={() => setShowUserSelector(false)} />
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-card border border-border">
            <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Create New Poll</h2>
              <p className="text-muted-foreground">Design your poll question and options for real-time voting</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Poll Question */}
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Poll Question *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your poll question..."
                          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                          data-testid="input-poll-question"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Poll Options */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Poll Options * (Minimum 2 options)
                  </label>
                  
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium text-sm">{index + 1}</span>
                        </div>
                        <FormField
                          control={form.control}
                          name={`options.${index}.text`}
                          render={({ field: optionField }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={`Enter option ${index + 1}...`}
                                  className="px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                                  data-testid={`input-option-${index}`}
                                  {...optionField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          disabled={fields.length <= 2}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2"
                          data-testid={`button-remove-option-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addOption}
                    className="mt-4 text-primary hover:text-primary/80 font-medium text-sm"
                    data-testid="button-add-option"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Option
                  </Button>
                </div>

                {/* Poll Settings */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-foreground mb-4">Poll Settings</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div>
                              <FormLabel className="text-sm font-medium text-foreground">
                                Publish Immediately
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Make this poll available for voting right away
                              </p>
                            </div>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-publish-immediately"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={createPollMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                    data-testid="button-create-poll"
                  >
                    {createPollMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Create Poll
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/")}
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
