import { PageLayout } from "@/layouts/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <PageLayout
      title="Settings"
      description="Configure system settings and preferences"
      breadcrumbs={[{ label: "Settings" }]}
    >
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>This page will contain system configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Settings Page</h3>
              <p className="text-muted-foreground">
                The system settings and configuration panel will be implemented here later
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
