"use client"
import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Site } from '@/types/site';

type Props = {
  sites: Site[]
  loading: boolean
  handleWebsiteChange: any
  selectedSite: any
}

const Selector = ({ sites, loading, handleWebsiteChange, selectedSite }: Props) => {
  return (
    <Select value={String(selectedSite?.id)} onValueChange={handleWebsiteChange}>
      {
        loading ?
          <p>Loading</p>
          :
          (
            sites?.length === 0 ? 'No data' :
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
          )
      }
      <SelectContent>
        {sites?.map((website) => (
          <SelectItem key={website.id} value={String(website.id)}>
            {website.url}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Selector