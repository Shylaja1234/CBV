import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, Link2, Cloud, X } from "lucide-react";

type ImageSource = "upload" | "gdrive" | "url";

interface ProductImagePickerProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  googleClientId: string;
  googleDeveloperKey: string;
}

export const ProductImagePicker: React.FC<ProductImagePickerProps> = ({
  imageUrl,
  setImageUrl,
  googleClientId,
  googleDeveloperKey,
}) => {
  const [tab, setTab] = useState<ImageSource>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Google Picker handler
  const openGooglePicker = () => {
    setLoading(true);
    // @ts-ignore
    window.gapi.load("auth", { callback: onAuthApiLoad });
    // @ts-ignore
    window.gapi.load("picker", { callback: onPickerApiLoad });
  };

  const onAuthApiLoad = () => {
    // @ts-ignore
    window.gapi.auth.authorize(
      {
        client_id: googleClientId,
        scope: ["https://www.googleapis.com/auth/drive.readonly"],
        immediate: false,
      },
      handleAuthResult
    );
  };

  const onPickerApiLoad = () => {
    setLoading(false);
  };

  const handleAuthResult = (authResult: any) => {
    if (authResult && !authResult.error) {
      createPicker(authResult.access_token);
    }
  };

  const createPicker = (accessToken: string) => {
    // @ts-ignore
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS_IMAGES)
      .setOAuthToken(accessToken)
      .setDeveloperKey(googleDeveloperKey)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const doc = data.docs[0];
      setImageUrl(doc.url || doc.embedUrl || "");
      setFile(null);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setImageUrl(url);
    }
  };

  // Handle HTTPS link
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setFile(null);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setFile(null);
  };

  return (
    <div className="w-full flex flex-col gap-y-2 sm:gap-y-4">
      <Tabs value={tab} onValueChange={v => setTab(v as ImageSource)} className="w-full">
        <TabsList className="w-full flex gap-2 mb-2 sm:mb-4">
          <TabsTrigger value="upload" className="flex-1 flex items-center gap-2 text-xs sm:text-base">
            <UploadCloud className="h-4 w-4" /> Upload
          </TabsTrigger>
          <TabsTrigger value="gdrive" className="flex-1 flex items-center gap-2 text-xs sm:text-base">
            <Cloud className="h-4 w-4" /> Google Drive
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1 flex items-center gap-2 text-xs sm:text-base">
            <Link2 className="h-4 w-4" /> HTTPS Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
        </TabsContent>

        <TabsContent value="gdrive">
          <Button
            type="button"
            onClick={openGooglePicker}
            disabled={loading}
            className="mb-2 w-full"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Cloud className="mr-2" />}
            Select from Google Drive
          </Button>
        </TabsContent>

        <TabsContent value="url">
          <Input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={tab === "url" ? imageUrl : ""}
            onChange={handleUrlChange}
            className="mb-2 w-full"
          />
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      <div className="w-full flex flex-col items-center mt-2">
        {imageUrl ? (
          <div className="relative w-full max-w-xs min-h-[120px] sm:min-h-[160px]">
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-lg border max-w-full h-auto object-contain mx-auto"
              style={{ maxHeight: 200 }}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 bg-background/80"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-xs min-h-[120px] sm:min-h-[160px] flex items-center justify-center border rounded-lg bg-muted text-muted-foreground">
            No image selected
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Supported: Upload, Google Drive, or HTTPS image link. Max size: 5MB.
      </p>
    </div>
  );
}; 