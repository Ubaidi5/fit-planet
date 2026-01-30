import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  suggestions: string[];
}

const calculateStrength = (password: string): StrengthResult => {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "",
      bgColor: "",
      suggestions: ["Enter a password to see strength"],
    };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 8) score += 1;
  else suggestions.push("Use at least 8 characters");

  if (password.length >= 12) score += 1;
  else if (password.length >= 8)
    suggestions.push("Use 12+ characters for better security");

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push("Add uppercase letters (A-Z)");

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push("Add lowercase letters (a-z)");

  // Number check
  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push("Add numbers (0-9)");

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else suggestions.push("Add special characters (!@#$%...)");

  // Determine strength level
  if (score <= 2) {
    return {
      score: 1,
      label: "Weak",
      color: "text-red-600",
      bgColor: "bg-red-600",
      suggestions,
    };
  } else if (score <= 4) {
    return {
      score: 2,
      label: "Fair",
      color: "text-orange-600",
      bgColor: "bg-orange-600",
      suggestions,
    };
  } else if (score <= 5) {
    return {
      score: 3,
      label: "Good",
      color: "text-yellow-600",
      bgColor: "bg-yellow-600",
      suggestions,
    };
  } else {
    return {
      score: 4,
      label: "Strong",
      color: "text-green-600",
      bgColor: "bg-green-600",
      suggestions: ["Great password! 🎉"],
    };
  }
};

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className={cn("mt-3 space-y-2", className)}>
      {/* Strength Bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              level <= strength.score ? strength.bgColor : "bg-gray-200",
            )}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-medium", strength.color)}>
          {strength.label}
        </span>
      </div>

      {/* Suggestions */}
      {strength.suggestions.length > 0 && strength.score < 4 && (
        <ul className="space-y-1 text-xs text-gray-600">
          {strength.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <svg
                className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {strength.score === 4 && (
        <p className="flex items-center gap-1.5 text-xs text-green-600">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          {strength.suggestions[0]}
        </p>
      )}
    </div>
  );
}

export default PasswordStrength;
