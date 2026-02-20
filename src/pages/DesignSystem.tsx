import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react'

export default function DesignSystem() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Design System</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A comprehensive, token-based design system for consistent UI development
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
          <p className="text-muted-foreground">Various button variants and sizes</p>
        </div>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  With Icon
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Cards Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Cards</h2>
          <p className="text-muted-foreground">Flexible card components with multiple sections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>A basic card with header and content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is the card content area where you can place any content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>Includes action buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Cards can have footers for actions or additional information.</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm" variant="outline">Cancel</Button>
              <Button size="sm">Confirm</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>With form elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your email..." />
              <Button className="w-full">Subscribe</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Inputs</h2>
          <p className="text-muted-foreground">Form input components</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Input</label>
              <Input placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Input</label>
              <Input type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Disabled Input</label>
              <Input placeholder="Disabled" disabled />
            </div>
          </div>
        </Card>
      </section>

      {/* Badges Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Badges</h2>
          <p className="text-muted-foreground">Status indicators and labels</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Card>
      </section>

      {/* Alerts Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Alerts</h2>
          <p className="text-muted-foreground">Notification and message components</p>
        </div>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert with default styling.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              This is a destructive alert indicating an error or warning.
            </AlertDescription>
          </Alert>

          <Alert className="border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              This is a success alert with custom styling.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Color Tokens */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Color System</h2>
          <p className="text-muted-foreground">Design tokens with light/dark mode support</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 space-y-2">
            <div className="h-16 rounded-md bg-primary" />
            <p className="text-sm font-medium">Primary</p>
          </Card>
          <Card className="p-4 space-y-2">
            <div className="h-16 rounded-md bg-secondary" />
            <p className="text-sm font-medium">Secondary</p>
          </Card>
          <Card className="p-4 space-y-2">
            <div className="h-16 rounded-md bg-accent" />
            <p className="text-sm font-medium">Accent</p>
          </Card>
          <Card className="p-4 space-y-2">
            <div className="h-16 rounded-md bg-destructive" />
            <p className="text-sm font-medium">Destructive</p>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Typography</h2>
          <p className="text-muted-foreground">Text styles and hierarchy</p>
        </div>

        <Card className="p-6 space-y-4">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-semibold">Heading 2</h2>
          <h3 className="text-2xl font-semibold">Heading 3</h3>
          <h4 className="text-xl font-semibold">Heading 4</h4>
          <p className="text-base">Body text - Regular paragraph with normal weight and size.</p>
          <p className="text-sm text-muted-foreground">Small text - Muted foreground color for secondary information.</p>
          <p className="text-xs text-muted-foreground">Extra small text - For captions and labels.</p>
        </Card>
      </section>
    </div>
  )
}
