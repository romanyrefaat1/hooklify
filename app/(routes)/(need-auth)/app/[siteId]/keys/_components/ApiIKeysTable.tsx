// _components/ApiKeysTable.js
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { SiteWidgetsContextType } from '@/contexts/SiteWidgetsContext';

const ApiKeysTable = ({ apiKeys, onRegenerateKey }: { apiKeys: SiteWidgetsContextType[]; onRegenerateKey: (id: string) => void }) => {
  return (
    <Card className="border-gray-200 custom-scrollbar" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <Table className='custom-scrollbar'>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-center font-medium text-gray-600">
              Site Name
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              API Key
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Site URL
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Created
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Last Used
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((site) => (
            <TableRow key={site.id} className="hover:bg-gray-50">
              <TableCell className="text-center">
                <div className="font-medium text-gray-900">
                  {site.name || 'Unnamed Site'}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                  {site.api_key}
                </code>
              </TableCell>
              <TableCell className="text-center text-gray-600">
                {site.site_url}
              </TableCell>
              <TableCell className="text-center text-gray-600">
                {site.created}
              </TableCell>
              <TableCell className="text-center text-gray-600">
                {site.lastUsed || 'Never'}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerateKey(site.id)}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Regenerate API key"
                >
                  <RotateCcw size={16} className="text-gray-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ApiKeysTable;