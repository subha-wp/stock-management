/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface TrendingSearch {
  query: string;
  count: number;
  lastSearchedAt: string;
}

export default function SearchTrendsPage() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [timeRange, setTimeRange] = useState("7");
  const [trending, setTrending] = useState<TrendingSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { businesses } = useBusiness();
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get unique cities from businesses
  const cities = Array.from(
    new Set(businesses.map((b) => b.city?.toLowerCase()).filter(Boolean))
  );

  const fetchTrending = async () => {
    if (!selectedCity) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search/trending?city=${selectedCity}&days=${timeRange}`
      );
      if (!response.ok) throw new Error("Failed to fetch trending searches");
      const data = await response.json();
      setTrending(data);
    } catch (error) {
      toast.error("Failed to fetch trending searches");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query || !selectedCity) return;

    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(
          query
        )}&city=${encodeURIComponent(selectedCity)}`
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchTrending();
    }
  }, [selectedCity, timeRange]);

  useEffect(() => {
    if (debouncedSearch) {
      fetchSuggestions(debouncedSearch);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch, selectedCity]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-[2]">
              <Input
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!selectedCity}
              />
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Suggestions:</h3>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded-md text-sm cursor-pointer hover:bg-accent"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading trending searches...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Search Query</TableHead>
                  <TableHead className="text-right">Search Count</TableHead>
                  <TableHead>Last Searched</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trending.map((search) => (
                  <TableRow key={search.query}>
                    <TableCell className="font-medium">
                      {search.query}
                    </TableCell>
                    <TableCell className="text-right">{search.count}</TableCell>
                    <TableCell>
                      {format(
                        new Date(search.lastSearchedAt),
                        "MMM d, yyyy HH:mm"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {trending.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No trending searches found for this city and time range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
