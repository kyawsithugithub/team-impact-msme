#pragma checksum "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "ed4208526d145544f205ad129fb12d3798e95f30"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Users_SignIn), @"mvc.1.0.view", @"/Views/Users/SignIn.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\_ViewImports.cshtml"
using MSME;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\_ViewImports.cshtml"
using MSME.Models;

#line default
#line hidden
#nullable disable
#nullable restore
#line 1 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
using Microsoft.AspNetCore.Mvc.Localization;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"ed4208526d145544f205ad129fb12d3798e95f30", @"/Views/Users/SignIn.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b96bc397e4dc044424df3d3f113c8f3d16b033f1", @"/Views/_ViewImports.cshtml")]
    public class Views_Users_SignIn : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("method", "post", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        #pragma warning restore 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 3 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
  
    ViewData["Title"] = "";
    Layout = "~/Views/Shared/_Layout_Public.cshtml";

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n<div class=\"row justify-content-center\">\r\n    <div class=\"col-md-6 col-md-offset-3\">\r\n        <div class=\"register-box\" style=\"width:100%;\">\r\n            <div class=\"card-body register-card-body\">\r\n                <p class=\"login-box-msg\">");
#nullable restore
#line 12 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
                                     Write(_localizer["Sign In"]);

#line default
#line hidden
#nullable disable
            WriteLiteral("</p>\r\n\r\n                ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "ed4208526d145544f205ad129fb12d3798e95f304570", async() => {
                WriteLiteral("\r\n\r\n                    <div class=\"input-group mb-3\">\r\n                        <button type=\"button\" class=\"btn btn-default\">");
#nullable restore
#line 17 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
                                                                  Write(_localizer["+95"]);

#line default
#line hidden
#nullable disable
                WriteLiteral("</button>\r\n                        <input type=\"number\" class=\"form-control\"");
                BeginWriteAttribute("placeholder", " placeholder=\"", 747, "\"", 792, 1);
#nullable restore
#line 18 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
WriteAttributeValue("", 761, _localizer["e.g 0912345678"], 761, 31, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(@">
                        <div class=""input-group-append"">
                            <div class=""input-group-text"">
                                <span class=""fas fa-mobile""></span>
                            </div>
                        </div>
                    </div>
                    <div class=""input-group mb-3"">
                        <input type=""password"" class=""form-control""");
                BeginWriteAttribute("placeholder", " placeholder=\"", 1198, "\"", 1237, 1);
#nullable restore
#line 26 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
WriteAttributeValue("", 1212, _localizer["Password"], 1212, 25, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(@">
                        <div class=""input-group-append"">
                            <div class=""input-group-text"">
                                <span class=""fas fa-lock""></span>
                            </div>
                        </div>
                    </div>
                    <div class=""row text-center"">
                        <div class=""col-sm-12"">
                            <a href=""#"" class=""text-center"">");
#nullable restore
#line 35 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
                                                        Write(_localizer["Forgot your password?"]);

#line default
#line hidden
#nullable disable
                WriteLiteral(@"</a>
                            
                        </div>
                        <!-- /.col -->

                    </div>
                    <div class=""row text-center"">
                        <div class=""col-sm-12"">
                            <button type=""submit"" class=""btn btn-primary btn-block"">");
#nullable restore
#line 43 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
                                                                                Write(_localizer["Sign In"]);

#line default
#line hidden
#nullable disable
                WriteLiteral(@"</button>
                        </div>
                        <!-- /.col -->

                    </div>
                    <div class=""row text-center"">
                        <div class=""col-sm-12"">
                            <hr />
                            <a");
                BeginWriteAttribute("href", " href=\"", 2345, "\"", 2383, 1);
#nullable restore
#line 51 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
WriteAttributeValue("", 2352, Url.Action("Register","Users"), 2352, 31, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" class=\"text-center\">");
#nullable restore
#line 51 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
                                                                                      Write(_localizer["Register User"]);

#line default
#line hidden
#nullable disable
                WriteLiteral("</a>\r\n                        </div>\r\n                        <!-- /.col -->\r\n\r\n                    </div>\r\n                ");
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper);
            BeginAddHtmlAttributeValues(__tagHelperExecutionContext, "action", 1, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
#nullable restore
#line 14 "C:\Users\thant\OneDrive\Business\Projects\MSME\Project\MSME\MSME\Views\Users\SignIn.cshtml"
AddHtmlAttributeValue("", 474, Url.Action("Authenticate","Users"), 474, 35, false);

#line default
#line hidden
#nullable disable
            EndAddHtmlAttributeValues(__tagHelperExecutionContext);
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper.Method = (string)__tagHelperAttribute_0.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r\n\r\n\r\n            </div>\r\n            <!-- /.form-box -->\r\n\r\n        </div>\r\n        <!-- /.register-box -->\r\n    </div>\r\n</div>\r\n\r\n\r\n");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public IViewLocalizer _localizer { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
