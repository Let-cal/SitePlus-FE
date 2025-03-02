import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import "@/lib/all-site/Header";
import Heading from "@/lib/all-site/Heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Định nghĩa schema validation cho form
const formSchema = z.object({
  // Step 1: Thông tin cơ bản
  brand: z.string().min(10, { message: "Vui lòng nhập thương hiệu" }),
  representativeName: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đại diện" }),
  representativeEmail: z.string().email({ message: "Email không hợp lệ" }),
  representativePhone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ" }),
  requestDate: z.date({ required_error: "Vui lòng chọn ngày" }),
  industry: z.string({ required_error: "Vui lòng chọn ngành nghề" }),
  targetCustomers: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất một đối tượng khách hàng" }),

  // Step 2: Thông tin chi tiết yêu cầu
  locationType: z.string({ required_error: "Vui lòng chọn loại mặt bằng" }),
  storeProfile: z.string({ required_error: "Vui lòng chọn loại cửa hàng" }),
  otherStoreProfileInfo: z.string().optional(),

  // Step 3: Thông tin diện tích và ngân sách
  minArea: z.string().min(1, { message: "Vui lòng nhập diện tích tối thiểu" }),
  maxArea: z.string().min(1, { message: "Vui lòng nhập diện tích tối đa" }),
  minBudget: z
    .string()
    .min(1, { message: "Vui lòng nhập ngân sách tối thiểu" }),
  maxBudget: z.string().min(1, { message: "Vui lòng nhập ngân sách tối đa" }),

  // Step 4: Thông tin vị trí
  city: z.string().default("Thành phố Hồ Chí Minh"),
  districts: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất một quận" }),
  street: z.string().optional(),
  nearbyAreas: z.array(z.string()),
  specialRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Định nghĩa kiểu cho các trường form theo từng bước
type Step1Fields =
  | "brand"
  | "representativeName"
  | "representativeEmail"
  | "representativePhone"
  | "requestDate"
  | "industry"
  | "targetCustomers";
type Step2Fields = "locationType" | "storeProfile" | "otherStoreProfileInfo";
type Step3Fields = "minArea" | "maxArea" | "minBudget" | "maxBudget";

const SurveyRequestsForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Thành phố Hồ Chí Minh",
      targetCustomers: [],
      nearbyAreas: [],
      districts: [],
    },
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Lấy giá trị của các trường để điều khiển logic
  const locationType = watch("locationType");
  const storeProfile = watch("storeProfile");
  const requestDate = watch("requestDate");

  const handleNext = async () => {
    let canProceed = false;

    if (step === 1) {
      // Validate fields của Step 1
      const step1Fields: Step1Fields[] = [
        "brand",
        "representativeName",
        "representativeEmail",
        "representativePhone",
        "requestDate",
        "industry",
        "targetCustomers",
      ];
      const step1Valid = await form.trigger(step1Fields);
      canProceed = step1Valid;
    } else if (step === 2) {
      // Validate fields của Step 2
      const step2Fields: Step2Fields[] = ["locationType", "storeProfile"];
      if (storeProfile === "other") {
        step2Fields.push("otherStoreProfileInfo");
      }
      const step2Valid = await form.trigger(step2Fields);
      canProceed = step2Valid;
    } else if (step === 3) {
      // Validate fields của Step 3
      const step3Fields: Step3Fields[] = [
        "minArea",
        "maxArea",
        "minBudget",
        "maxBudget",
      ];
      const step3Valid = await form.trigger(step3Fields);
      canProceed = step3Valid;
    }

    if (canProceed && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Xử lý gửi dữ liệu form ở đây
    alert("Đã gửi yêu cầu thành công!");
  };

  // Danh sách quận ở TP.HCM
  const districts = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Quận Bình Thạnh",
    "Quận Tân Bình",
    "Quận Tân Phú",
    "Quận Phú Nhuận",
    "Quận Gò Vấp",
    "Quận Thủ Đức",
  ];

  // Danh sách loại khách hàng
  const customerTypes = [
    { id: "student", label: "Học sinh/Sinh viên" },
    { id: "worker", label: "Công nhân" },
    { id: "office", label: "Nhân viên công chức" },
    { id: "children", label: "Trẻ em" },
    { id: "family", label: "Gia đình" },
    { id: "business", label: "Doanh nhân" },
  ];

  // Danh sách khu vực
  const areaTypes = [
    { id: "mall", label: "Trung tâm thương mại" },
    { id: "residential", label: "Khu dân cư" },
    { id: "school", label: "Gần trường học" },
    { id: "busStation", label: "Bến xe buýt" },
  ];

  // Render form dựa trên step hiện tại
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Heading
              text="Thông tin cơ bản"
              center={true}
              size="sm"
              hasMargin={false}
            />
            <div className="space-y-2">
              <Label htmlFor="brand">
                Thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand"
                {...form.register("brand")}
                placeholder="Nhập tên thương hiệu"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="representativeName">
                Tên đại diện <span className="text-red-500">*</span>
              </Label>
              <Input
                id="representativeName"
                {...form.register("representativeName")}
                placeholder="Nhập tên đại diện"
              />
              {errors.representativeName && (
                <p className="text-red-500 text-sm">
                  {errors.representativeName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="representativeEmail">
                Email đại diện <span className="text-red-500">*</span>
              </Label>
              <Input
                id="representativeEmail"
                type="email"
                {...form.register("representativeEmail")}
                placeholder="example@company.com"
              />
              {errors.representativeEmail && (
                <p className="text-red-500 text-sm">
                  {errors.representativeEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="representativePhone">
                Số điện thoại đại diện <span className="text-red-500">*</span>
              </Label>
              <Input
                id="representativePhone"
                {...form.register("representativePhone")}
                placeholder="0901234567"
              />
              {errors.representativePhone && (
                <p className="text-red-500 text-sm">
                  {errors.representativePhone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestDate">
                Ngày gửi request <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {requestDate ? (
                      format(requestDate, "dd/MM/yyyy")
                    ) : (
                      <span className="text-muted-foreground">Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={requestDate}
                    onSelect={(date) => date && setValue("requestDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.requestDate && (
                <p className="text-red-500 text-sm">
                  {errors.requestDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">
                Ngành nghề <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("industry", value)}
                defaultValue={watch("industry")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fnb">F&B (Thực phẩm & Đồ uống)</SelectItem>
                  <SelectItem value="fashion">Thời trang</SelectItem>
                  <SelectItem value="retail">Bán lẻ</SelectItem>
                  <SelectItem value="service">Dịch vụ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-red-500 text-sm">
                  {errors.industry.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Mô hình khách hàng đang nhắm tới{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {customerTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`customer-${type.id}`}
                      onCheckedChange={(checked) => {
                        const currentValues = watch("targetCustomers") || [];
                        if (checked) {
                          setValue("targetCustomers", [
                            ...currentValues,
                            type.id,
                          ]);
                        } else {
                          setValue(
                            "targetCustomers",
                            currentValues.filter((value) => value !== type.id)
                          );
                        }
                      }}
                      checked={watch("targetCustomers")?.includes(type.id)}
                    />
                    <Label htmlFor={`customer-${type.id}`} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.targetCustomers && (
                <p className="text-red-500 text-sm">
                  {errors.targetCustomers.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Heading
              text="Thông tin chi tiết yêu cầu"
              center={true}
              size="sm"
              hasMargin={false}
            />
            <div className="space-y-2">
              <Label>
                Loại mặt bằng <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                onValueChange={(value) => {
                  setValue("locationType", value);
                  // Reset storeProfile khi đổi locationType
                  setValue("storeProfile", "");
                }}
                value={watch("locationType")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inside" id="inside" />
                  <Label htmlFor="inside">Mặt bằng trong tòa nhà</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outside" id="outside" />
                  <Label htmlFor="outside">Mặt bằng độc lập</Label>
                </div>
              </RadioGroup>
              {errors.locationType && (
                <p className="text-red-500 text-sm">
                  {errors.locationType.message}
                </p>
              )}
            </div>

            {watch("locationType") && (
              <div className="space-y-2">
                <Label>
                  Loại cửa hàng <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("storeProfile", value)}
                  value={watch("storeProfile")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại cửa hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationType === "inside" ? (
                      <SelectItem value="kiosk">Kiosk</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="traditional">
                          Traditional Store
                        </SelectItem>
                        <SelectItem value="drive-thru">Drive-thru</SelectItem>
                      </>
                    )}
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                {errors.storeProfile && (
                  <p className="text-red-500 text-sm">
                    {errors.storeProfile.message}
                  </p>
                )}
              </div>
            )}

            {storeProfile === "other" && (
              <div className="space-y-2">
                <Label htmlFor="otherStoreProfileInfo">
                  Thông tin chi tiết loại cửa hàng{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="otherStoreProfileInfo"
                  {...form.register("otherStoreProfileInfo")}
                  placeholder="Vui lòng mô tả chi tiết về loại cửa hàng mong muốn"
                />
                {errors.otherStoreProfileInfo && (
                  <p className="text-red-500 text-sm">
                    {errors.otherStoreProfileInfo.message}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Heading
              text="Thông tin diện tích và ngân sách"
              center={true}
              size="sm"
              hasMargin={false}
            />
            <div className="space-y-2">
              <Label>
                Diện tích mong muốn (m²) <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="minArea" className="text-sm">
                    Tối thiểu
                  </Label>
                  <Input
                    id="minArea"
                    {...form.register("minArea")}
                    placeholder="30"
                    type="number"
                  />
                  {errors.minArea && (
                    <p className="text-red-500 text-sm">
                      {errors.minArea.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maxArea" className="text-sm">
                    Tối đa
                  </Label>
                  <Input
                    id="maxArea"
                    {...form.register("maxArea")}
                    placeholder="100"
                    type="number"
                  />
                  {errors.maxArea && (
                    <p className="text-red-500 text-sm">
                      {errors.maxArea.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Ngân sách thuê (VNĐ/tháng){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="minBudget" className="text-sm">
                    Tối thiểu
                  </Label>
                  <Input
                    id="minBudget"
                    {...form.register("minBudget")}
                    placeholder="10,000,000"
                    type="number"
                  />
                  {errors.minBudget && (
                    <p className="text-red-500 text-sm">
                      {errors.minBudget.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maxBudget" className="text-sm">
                    Tối đa
                  </Label>
                  <Input
                    id="maxBudget"
                    {...form.register("maxBudget")}
                    placeholder="30,000,000"
                    type="number"
                  />
                  {errors.maxBudget && (
                    <p className="text-red-500 text-sm">
                      {errors.maxBudget.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <CardTitle className="text-center">Thông tin vị trí</CardTitle>

            <div className="space-y-2">
              <Label htmlFor="city">Thành phố</Label>
              <Input id="city" value="Thành phố Hồ Chí Minh" disabled />
            </div>

            <div className="space-y-2">
              <Label>
                Quận <span className="text-red-500">*</span>
              </Label>
              <div className="border rounded-md p-2">
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {districts.map((district) => (
                    <div key={district} className="flex items-center space-x-2">
                      <Checkbox
                        id={`district-${district}`}
                        onCheckedChange={(checked) => {
                          const currentDistricts = watch("districts") || [];
                          if (checked) {
                            setValue("districts", [
                              ...currentDistricts,
                              district,
                            ]);
                          } else {
                            setValue(
                              "districts",
                              currentDistricts.filter((d) => d !== district)
                            );
                          }
                        }}
                        checked={watch("districts")?.includes(district)}
                      />
                      <Label
                        htmlFor={`district-${district}`}
                        className="text-sm"
                      >
                        {district}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {errors.districts && (
                <p className="text-red-500 text-sm">
                  {errors.districts.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Đường (tùy chọn)</Label>
              <Input
                id="street"
                {...form.register("street")}
                placeholder="Tên đường mong muốn"
              />
            </div>

            <div className="space-y-2">
              <Label>Gần khu vực</Label>
              <div className="grid grid-cols-2 gap-2">
                {areaTypes.map((area) => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`area-${area.id}`}
                      onCheckedChange={(checked) => {
                        const currentAreas = watch("nearbyAreas") || [];
                        if (checked) {
                          setValue("nearbyAreas", [...currentAreas, area.id]);
                        } else {
                          setValue(
                            "nearbyAreas",
                            currentAreas.filter((a) => a !== area.id)
                          );
                        }
                      }}
                      checked={watch("nearbyAreas")?.includes(area.id)}
                    />
                    <Label htmlFor={`area-${area.id}`} className="text-sm">
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Yêu cầu đặc biệt khác</Label>
              <Textarea
                id="specialRequirements"
                {...form.register("specialRequirements")}
                placeholder="Nhập các yêu cầu đặc biệt khác (nếu có)"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            Bước {step}/{totalSteps}
          </p>
          <p className="text-sm font-medium">
            {Math.round((step / totalSteps) * 100)}%
          </p>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2" />
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="pt-4">{renderStepContent()}</CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>

          {step < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Tiếp theo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit">
              Gửi yêu cầu
              <Check className="ml-1 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default SurveyRequestsForm;
