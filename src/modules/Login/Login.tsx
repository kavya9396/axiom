import React from "react";
import { Box, Divider, Typography, Link } from "@mui/material";
import LoginImage from "../../assets/Login-Image.svg";
import IPRULogo from "../../assets/ICICI-Logo.svg";
import AxiomLogo from "../../assets/Axiom Logo.svg";
import IBMLogo from "../../assets/IBM Logo.svg";
import { centerFlex, columnFlex } from "../../utils/styles";
import CustomTextField from "../../components/ui/TextField/TextField";
import CustomCheckbox from "../../components/ui/Checkbox/Checkbox";
import CustomButton from "../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { getInboxPath } from "../../routes/routes";
import { loginThunk } from "../../store/thunks/loginThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { VALIDATIONS } from "../../validations/loginValidations";

type LoginForm = {
    username: string;
    password: string;
};

type FormErrors = {
    username?: string;
    password?: string;
};
const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loading = useAppSelector((state) => state.login.auth.loading);
    const [formData, setFormData] = React.useState<LoginForm>({
        username: "",
        password: "",
    });
    const [errors, setErrors] = React.useState<FormErrors>({});

    const validateField = (field: keyof LoginForm, value: string): string | undefined => {
        const fieldValidations = VALIDATIONS[field];

        // Check required
        if (fieldValidations.required && !value.trim()) {
            return fieldValidations.required;
        }

        // Check pattern
        if ("pattern" in fieldValidations && value.trim()) {
            const { value: pattern, message } = fieldValidations.pattern;
            if (!pattern.test(value)) {
                return message;
            }
        }

        // Check minLength
        if ("minLength" in fieldValidations && value.trim()) {
            const { value: minLen, message } = fieldValidations.minLength;
            if (value.length < minLen) {
                return message;
            }
        }

        return undefined;
    };

    const handleChange =
        (field: keyof LoginForm) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                }));

                // Validate field and update errors
                const error = validateField(field, value);
                setErrors((prev) => ({
                    ...prev,
                    [field]: error,
                }));
            };

    const onSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const data = formData;

        // Validate all fields
        const usernameError = validateField("username", data.username);
        const passwordError = validateField("password", data.password);

        if (usernameError || passwordError) {
            setErrors({
                username: usernameError,
                password: passwordError,
            });
            return;
        }

        try {
            const res = await dispatch(
                loginThunk({
                    username: data.username,
                    password: data.password,
                })
            ).unwrap();

            if (res?.ldapAuthentication === "Success") {
                const normalizedBusinessType = "retail";

                localStorage.setItem("token", res.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("password", data.password);
                localStorage.setItem("businessType", normalizedBusinessType);

                // await dispatch(fetchMastersForSession());

                navigate(getInboxPath());
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Left Section */}
            <Box sx={{ width: "50%", position: "relative" }}>
                <Box
                    component="img"
                    src={LoginImage}
                    alt="Underwriter reviewing and filling out an insurance form"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>

            {/* Right Section */}
            <Box
                sx={{
                    width: "50%",
                    ...centerFlex,
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        px: 4,
                        py: 2,
                        gap: 2.5,
                        ...columnFlex,
                    }}
                >
                    {/* Logo */}
                    <Box>
                        <Box
                            component="img"
                            src={IPRULogo}
                            alt="ICICI Prudential Logo"
                            sx={{ height: 40 }}
                        />
                    </Box>

                    {/* Header */}
                    <Box>
                        <Box component="img" src={AxiomLogo} alt="Axiom Logo" />
                        <Typography variant="body1" color="text.secondary">
                            Log in to access your account
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{
                            ...columnFlex,
                            gap: 1,
                        }}
                    >
                        {/* Username */}
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                User ID*
                            </Typography>

                            <CustomTextField
                                fullWidth
                                placeholder="Enter your User ID"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange("username")}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                        </Box>

                        {/* Password */}
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Password*
                            </Typography>

                            <CustomTextField
                                fullWidth
                                type="password"
                                placeholder="Enter your Password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange("password")}
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 1, fontSize: "11px" }}
                            >
                                It must be at least 8 characters long and include letters and numbers.
                            </Typography>
                        </Box>

                        {/* Remember */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <CustomCheckbox label="Remember me" />
                        </Box>

                        {/* Login Button */}
                        <CustomButton
                            fullWidth
                            variant="contained"
                            sx={{ borderRadius: "50px" }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Log In"}
                        </CustomButton>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ textAlign: "center" }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "11px" }}
                        >
                            © 2026 ICICI Prudential Insurance,&nbsp;
                            <Link href="#" underline="hover">
                                Privacy Policy
                            </Link>
                            &nbsp; | &nbsp;
                            <Link href="#" underline="hover">
                                Terms and Conditions
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                {/* Bottom Branding */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2">Powered by</Typography>
                    <Box component="img" src={IBMLogo} alt="IBM Logo" />
                </Box>
            </Box>
        </Box>
    );
};

export default Login;