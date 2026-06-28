interface Message {
  role: string;
  content: string;
}

interface Props {
  messages: Message[];
}

export function MessageList({
  messages,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <div
          key={index}
          className="rounded border p-3"
        >
          <strong>
            {message.role}
          </strong>

          <p>
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
}