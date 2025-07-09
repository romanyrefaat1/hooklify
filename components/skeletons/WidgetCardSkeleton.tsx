"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function WidgetCardSkeleton() {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200 group hover:scale-[1.01] bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
            <div>
              <CardTitle className="text-base">
                <Skeleton className="h-4 w-32 bg-gray-200" />
              </CardTitle>
              <Badge className="mt-1 bg-gray-100 text-gray-600 border border-gray-300">
                <Skeleton className="h-3 w-12 bg-gray-200" />
              </Badge>
            </div>
          </div>
          <Skeleton className="h-6 w-6 rounded bg-gray-200" />
        </div>
        <CardDescription className="line-clamp-2 mt-2 text-gray-500">
          <Skeleton className="h-4 w-full mb-1 bg-gray-200" />
          <Skeleton className="h-4 w-3/4 bg-gray-200" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-xs mb-4 text-gray-400">
          <Skeleton className="h-3 w-3 rounded-full bg-gray-300" />
          <Skeleton className="h-3 w-24 bg-gray-300" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-6 rounded bg-gray-300" />
            <Skeleton className="h-6 w-6 rounded bg-gray-300" />
            <Skeleton className="h-6 w-6 rounded bg-gray-300" />
          </div>
          <Skeleton className="h-6 w-6 rounded bg-gray-300" />
        </div>
      </CardContent>
    </Card>
  );
}