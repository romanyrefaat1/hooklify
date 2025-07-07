"use client"

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function SearchInput ({ queryName }: { queryName?: string}) {
    const [ query, setQuery ] = useState<string>("");
    if (!queryName) {
        queryName = "q"
    }
    
    const searchParams = useSearchParams()
    const q = searchParams.get(queryName);

    useEffect(()=> {
        if (q) {
            setQuery(q);
        }
    }, [q])
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        const url = new URL(window.location.href);
        url.searchParams.set(queryName, e.target.value);
        window.history.replaceState({}, '', url.toString());
    }

    useEffect(() => {
        const url = new URL(window.location.href);
        const query = url.searchParams.get(queryName);
        if (query) {
            handleSearch({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
        } else {
            url.searchParams.delete(queryName);
            window.history.replaceState({}, '', url.toString());
        }
    }, [queryName, query])
    
    return (
        <div className="relative flex-1 max-w-md">
            <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <Input 
                type="search" 
                placeholder="Search for an Website"
                value={query}
                onChange={(e) => handleSearch(e)}
                className="pl-10 h-12 text-base border-2 transition-all duration-200 focus:border-2"
                style={{ 
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                }}
            />
        </div>
    )
}