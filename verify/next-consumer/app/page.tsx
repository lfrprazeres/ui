// Deliberately NOT a client component. If the "use client" directives inside
// the package were stripped or hoisted by the build, Next fails here with
// "You're importing a component that needs useState", which is the whole point
// of this file.

import { Button } from "@lfrprazeres/ui";
import {
  Chip,
  Marquee,
  MessageBubble,
  StatTile,
  StreamingDots,
} from "@lfrprazeres/ui/components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@lfrprazeres/ui/elements";

export default function Page() {
  return (
    <main className="space-y-6 p-8">
      <h1 className="font-semibold text-2xl text-foreground">
        Scratch consumer
      </h1>

      <div className="flex flex-wrap items-center gap-2">
        <Button>Root barrel</Button>
        <Button variant="secondary">Secondary</Button>
        <Chip variant="accent">components subpath</Chip>
      </div>

      <StatTile
        delta={{ direction: "up", label: "+4.2%" }}
        label="From /components"
        value="1,204"
      />

      <Card>
        <CardHeader>
          <CardTitle>From /elements</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Typed props resolve" />
        </CardContent>
      </Card>

      {/* Client-boundary component rendered from a server component. */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog (client boundary)</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSC boundary held</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Marquee fade>
        <Chip>Marquee</Chip>
        <Chip>is</Chip>
        <Chip>also</Chip>
        <Chip>a client component</Chip>
      </Marquee>

      {/* StreamingDots is a server component. MessageBubble is a client one,
          rendered here from a server component to prove the boundary. */}
      <MessageBubble from="user">
        Rendered from a server component
      </MessageBubble>
      <MessageBubble from="assistant">
        <StreamingDots />
      </MessageBubble>
    </main>
  );
}
