import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-zinc-500">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}