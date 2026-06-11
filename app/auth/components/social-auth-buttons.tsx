import { GoogleIcon } from "@/components/icons/google-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "../actions";

export function SocialAuthButtons() {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="submit"
        formAction={signInWithGoogle}
        formNoValidate
        variant="outline"
        className="h-10 justify-center gap-2 rounded-lg border-border bg-background text-sm text-foreground"
      >
        <GoogleIcon className="size-4" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 justify-center gap-2 rounded-lg border-border bg-background text-sm text-foreground"
      >
        <LinkedInIcon className="size-4 text-[#0A66C2]" />
        Continue with LinkedIn
      </Button>
    </div>
  );
}
