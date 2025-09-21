import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Rocket, Sparkles, Settings, Users, BarChart3 } from "lucide-react";
import { createPoll } from "@/lib/api";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

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
      if (!user) {
        throw new Error("User not authenticated");
      }
      return createPoll({
        ...data,
        userId: user.id,
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
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-6 text-center">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create New Poll</h1>
            <p className="text-purple-100 text-base font-medium">Design your poll and start collecting responses in real-time</p>
            <div className="mt-4 flex justify-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <BarChart3 className="h-3 w-3 text-green-300" />
                <span className="text-white text-xs font-medium">Real-time Results</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Users className="h-3 w-3 text-blue-300" />
                <span className="text-white text-xs font-medium">Unlimited Votes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Poll Form */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
          <CardContent className="p-6">

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Enhanced Poll Question */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-purple-900 flex items-center space-x-2">
                        <div className="p-1.5 bg-purple-500 rounded-md">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <span>Poll Question</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What would you like to ask your audience? Make it engaging and clear..."
                          className="min-h-[80px] resize-none bg-white border-purple-300 text-gray-900 placeholder:text-purple-400 focus:border-purple-500 focus:ring-purple-500 text-base font-medium shadow-sm"
                          {...field}
                          data-testid="textarea-poll-question"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Enhanced Poll Options */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1.5 bg-blue-500 rounded-md">
                    <BarChart3 className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-blue-900">Poll Options</h3>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="group relative">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <FormField
                          control={form.control}
                          name={`options.${index}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={`Enter option ${index + 1}...`}
                                  className="bg-white border-blue-300 text-gray-900 placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-500 font-medium shadow-sm group-hover:shadow-md transition-all"
                                  {...field}
                                  data-testid={`input-option-${index}`}
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
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-lg"
                          data-testid={`button-remove-option-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={addOption}
                  className="mt-4 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all"
                  data-testid="button-add-option"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Option
                </Button>
              </div>

              {/* Enhanced Poll Settings */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1.5 bg-green-500 rounded-md">
                    <Settings className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-green-900">Poll Settings</h3>
                </div>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                          <div>
                            <FormLabel className="text-sm font-bold text-green-900">
                              🚀 Publish Immediately
                            </FormLabel>
                            <p className="text-xs text-green-600 mt-0.5">
                              Make this poll available for voting right away and start collecting responses
                            </p>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="w-5 h-5 border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              data-testid="checkbox-publish-immediately"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Enhanced Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={createPollMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  data-testid="button-create-poll"
                >
                  {createPollMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Your Poll...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Rocket className="w-4 h-4" />
                      <span>Create Poll</span>
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 text-base transition-all duration-300 transform hover:-translate-y-1"
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
    </div>
  );
}
