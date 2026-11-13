import { ArrowUpRightIcon,  FolderCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function TableNoData() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
        <FolderCode />
        </EmptyMedia>
        <EmptyTitle>No Data Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any data yet.
        </EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent className="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyContent>
      <Button variant="link" className="text-muted-foreground" size="sm" nativeButton={false} render={<a href="#">Learn More <ArrowUpRightIcon /></a>} /> */}
    </Empty>
  )
}
