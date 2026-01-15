interface SubmittedDataDisplayProps {
  data: unknown;
}

export function SubmittedDataDisplay({ data }: SubmittedDataDisplayProps) {
  if (!data) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Submitted Data
      </h3>
      <pre className="bg-white rounded p-4 overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
