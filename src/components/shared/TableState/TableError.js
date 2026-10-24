import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/components/ui/empty"
import { OctagonXIcon } from 'lucide-react'
import { Button } from "@/src/components/ui/button"


export function TableError({ error, refetch }) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <OctagonXIcon />
        </EmptyMedia>
        <EmptyTitle>An Error Occured while Processing your request</EmptyTitle>
        <EmptyDescription>
          Error Details: {error.message}
          feel free to refresh the data.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          refresh Data
        </Button>
      </EmptyContent>
    </Empty>
  )
}
