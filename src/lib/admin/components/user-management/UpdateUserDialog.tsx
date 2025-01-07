import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { adminService } from "@/services/admin/admin.service";
import { Pencil } from "lucide-react";
import { useSnackbar } from "notistack";
import * as React from "react";
import swal from "sweetalert";

import { useEffect, useState } from "react";

const UpdateUserDialog = ({ user, onUpdate, asTrigger = false }) => {
  const [open, setOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState(
    user.areaSplit?.[0] || ""
  );
  const [selectedDistrictName, setSelectedDistrictName] = useState(
    user.areaSplit?.[1] || ""
  );
  const [status, setStatus] = useState(user.status);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      const initializeData = async () => {
        try {
          // Fetch provinces
          const provincesData = await adminService.getAllProvinces();
          setProvinces(provincesData);

          // Find province code that matches the user's province name
          const provinceMatch = provincesData.find(
            (p) => p.name === user.areaSplit?.[0]
          );

          if (provinceMatch) {
            setSelectedProvinceCode(provinceMatch.code);
            // Fetch districts for the matched province
            const districtsData = await adminService.getDistrictsByProvince(
              provinceMatch.code
            );
            setDistricts(districtsData);

            // Find district code that matches the user's district name
            const districtMatch = districtsData.find(
              (d) => d.name === user.areaSplit?.[1]
            );

            if (districtMatch) {
              setSelectedDistrictCode(districtMatch.code);
            }
          }
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      };

      initializeData();
    }
  }, [open, user.areaSplit]);

  const handleProvinceChange = async (value) => {
    const selectedProvince = provinces.find((p) => p.code === value);
    setSelectedProvinceCode(value);
    setSelectedProvinceName(selectedProvince?.name || "");

    // Reset district when province changes
    setSelectedDistrictCode("");
    setSelectedDistrictName("");

    // Fetch new districts
    try {
      const districtsData = await adminService.getDistrictsByProvince(value);
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = (value) => {
    const selectedDistrict = districts.find((d) => d.code === value);
    setSelectedDistrictCode(value);
    setSelectedDistrictName(selectedDistrict?.name || "");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const area =
        user.roleName === "Manager"
          ? selectedProvinceName
          : ["Area-Manager", "Staff"].includes(user.roleName)
          ? `${selectedProvinceName}, ${selectedDistrictName}`
          : user.area;

      await adminService.updateUser({
        id: user.id,
        area,
        status,
      });

      await onUpdate();
      swal("No error!", "Update successfully!", "success");
      setOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update user",
        {
          variant: "error",
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          preventDuplicate: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {asTrigger ? (
        <DialogTrigger asChild>
          <div
            className="flex items-center justify-start gap-2 text-sm hover:bg-accent w-full cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Update
          </div>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Update User</DialogTitle>
          <DialogDescription>
            Update the user's information and status below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Badge>{user.roleName}</Badge>
            </div>
          </Card>

          {["Manager", "Area-Manager", "Staff"].includes(user.roleName) && (
            <div className="space-y-4">
              <div>
                <Label>Province</Label>
                <Select
                  value={selectedProvinceCode}
                  onValueChange={handleProvinceChange}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue
                      placeholder={selectedProvinceName || "Select province"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {["Area-Manager", "Staff"].includes(user.roleName) && (
                <div>
                  <Label>District</Label>
                  <Select
                    value={selectedDistrictCode}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedProvinceCode}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue
                        placeholder={selectedDistrictName || "Select district"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <Switch
              checked={status}
              onCheckedChange={setStatus}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-600"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
