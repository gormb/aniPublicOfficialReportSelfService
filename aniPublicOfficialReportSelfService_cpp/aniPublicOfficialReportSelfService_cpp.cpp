// aniPublicOfficialReportSelfService_cpp.cpp : Defines the entry point for the application.
//

#include "framework.h"
#include "..\..\aniCommon_cpp\Ani.h"
#include "aniPublicOfficialReportSelfService_cpp.h"

#pragma region _g_ - Global variables
HWND _g_hDlg = 0, _g_hTree;
HTREEITEM _g_hNodeCmd;
Ani* _g_pai;
#pragma endregion 

#pragma region Tvw - Tree View
HTREEITEM TvwAdd(HTREEITEM hParent, LPCWSTR sz)
{
    TV_INSERTSTRUCT tvis{  };
    tvis.hParent = hParent;
    tvis.hInsertAfter = TVI_LAST;
    tvis.item.mask = TVIF_TEXT;
    tvis.item.pszText = (LPWSTR)sz;
    tvis.item.cchTextMax = 0;
    HTREEITEM hNode = (HTREEITEM)SendMessage(_g_hTree, TVM_INSERTITEM, 0, (LPARAM)(&tvis));
    if (hParent)
        SendMessage(_g_hTree, TVM_EXPAND, (WPARAM)TVE_EXPAND, (LPARAM)hParent);
    return hNode;
}

HTREEITEM TvwAdd(LPCWSTR sz)
{
    return TvwAdd(0, sz);
}

HTREEITEM TvwAdd(LPCWSTR sz, LPWSTR* pszC)
{
    HTREEITEM hP = TvwAdd(sz);
    for (LPWSTR* psz = pszC; *psz; psz++)
        TvwAdd(hP, *psz);
    return hP;
}

TCHAR* TvwText(TCHAR* szTvwText, SIZE_T lTvwText, WPARAM wParam, LPARAM lParam)
{
    swprintf(szTvwText, lTvwText, L"wParam %ui64, lParam %i64, LO(wParam) %ui16", (UINT)wParam, (UINT)lParam, LOWORD(wParam));
    return szTvwText;
}
void TvwInit()
{
    TvwAdd(TvwAdd(L"Hello"), L"World");
    _g_hNodeCmd = TvwAdd(TvwAdd(L"Debug"), L"Cmd");
    TvwAdd(L"Linear Regression - AI/ML MVP - Weights", (new AiHelloWorld())->TrainAndEvaluate());
}
#pragma endregion 

#pragma region Edt - Edits and texts
HWND MsgSetTxt(WORD c, LPCWSTR sz)
{
    HWND hc = GetDlgItem(_g_hDlg, c);
    SendMessage(hc, WM_SETTEXT, NULL, (LPARAM)sz);
    return hc;
}
LPWSTR MsgGetTxt(WORD c, LPWSTR sz, WORD lsz)
{
    HWND hc = GetDlgItem(_g_hDlg, c);
    GetWindowText(hc, sz, lsz);
    return sz;
}
void TxtInit()
{
    MsgSetTxt(IDC_EDIT1, L"Kapittelstruktur med Kapittel 1-2 deretter Underkapittel 1a-2b for:: ");
    MsgSetTxt(IDC_EDIT2, L"Vinterfiske handler ofte om å få mest mulig ut av de forskjellige artene som finnes langs svaberget. Sjøørret er den mest populære fisken, og den er enkel å få tak i i høykvalitet. Du finner den i fjorder, skjærgårder og langs kysten. Torsk er også vanlig, og den fiskes best i områder med hardbunn som skjær og viker. Den rikholdige fjære som finnes langs kysten kan også by på gode fiskemuligheter. Lyr og sei er også vanlige fiskearter og kan også fanges fra båt.Det er mange som driver med artsfiske og prøver å fange så mange forskjellige arter som mulig.Dette krever ofte at man spesialiserer seg på en bestemt type fisk og fiske metode.Dette bør man gjøre med stor forsiktighet, da man kan ødelegge sensitive økosystemer som fisker etter.");
    MsgSetTxt(IDC_EDIT3, L"*\nInnledning: ");
    MsgSetTxt(IDC_EDIT4, L"*\nBrødtekst: ");
    MsgSetTxt(IDC_EDIT5, L"\nLag bildebeskrivelse for passende bilde på mindre enn 40 ord:");
}
#pragma endregion

#pragma region Oai - Call OpenAI functionality; GPT, DALL-E
INT_PTR OaiGptTest()
{
    wchar_t sz[1000];
    MsgSetTxt(IDC_EDITGPTIN, MsgGetTxt(IDC_EDIT2, sz, 1000));
    return TRUE;
}

INT_PTR OaiTest()
{
    return OaiGptTest();
}
#pragma endregion 

#pragma region Msg - Message loop and message handlers

BOOL MsgInit(HWND hD)
{
    _g_hDlg = hD;
    _g_hTree = (HWND)GetDlgItem(_g_hDlg, IDC_TREE1);
    TvwInit();
    TxtInit();
    return TRUE;
}

INT_PTR CALLBACK Msg(HWND hD, UINT msg, WPARAM wParam, LPARAM lParam)
{
    TCHAR szBuf[256];
    switch (msg)
    {
    case WM_INITDIALOG: return MsgInit(hD);
    case WM_COMMAND:
        switch (LOWORD(wParam))
        {
        case IDCANCEL:      return EndDialog(hD, LOWORD(wParam)); //PostQuitMessage(0);
        case IDOK:          return (INT_PTR)TvwAdd(_g_hNodeCmd, L"OK");
        case IDC_BUTTONGPT: return OaiTest();
        default:            return (INT_PTR)TvwAdd(_g_hNodeCmd, TvwText(szBuf, 256, wParam, lParam));
        }
    default: return FALSE;
    }
}
#pragma endregion

int APIENTRY wWinMain(_In_ HINSTANCE, _In_opt_ HINSTANCE, _In_ LPWSTR, _In_ int)
{
    DialogBox(0, MAKEINTRESOURCE(IDD_ABOUTBOX), GetDesktopWindow(), Msg);
    return 0;
}

/*
#define MAX_LOADSTRING 100

// Global Variables:
HINSTANCE hInst;                                // current instance
WCHAR szTitle[MAX_LOADSTRING];                  // The title bar text
WCHAR szWindowClass[MAX_LOADSTRING];            // the main window class name

// Forward declarations of functions included in this code module:
ATOM                MyRegisterClass(HINSTANCE hInstance);
BOOL                InitInstance(HINSTANCE, int);
LRESULT CALLBACK    WndProc(HWND, UINT, WPARAM, LPARAM);
INT_PTR CALLBACK    About(HWND, UINT, WPARAM, LPARAM);

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
                     _In_opt_ HINSTANCE hPrevInstance,
                     _In_ LPWSTR    lpCmdLine,
                     _In_ int       nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

    // TODO: Place code here.

    // Initialize global strings
    LoadStringW(hInstance, IDS_APP_TITLE, szTitle, MAX_LOADSTRING);
    LoadStringW(hInstance, IDC_ANIPUBLICOFFICIALREPORTSELFSERVICECPP, szWindowClass, MAX_LOADSTRING);
    MyRegisterClass(hInstance);

    // Perform application initialization:
    if (!InitInstance (hInstance, nCmdShow))
    {
        return FALSE;
    }

    HACCEL hAccelTable = LoadAccelerators(hInstance, MAKEINTRESOURCE(IDC_ANIPUBLICOFFICIALREPORTSELFSERVICECPP));

    MSG msg;

    // Main message loop:
    while (GetMessage(&msg, nullptr, 0, 0))
    {
        if (!TranslateAccelerator(msg.hwnd, hAccelTable, &msg))
        {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
    }

    return (int) msg.wParam;
}



//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEXW wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);

    wcex.style          = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc    = WndProc;
    wcex.cbClsExtra     = 0;
    wcex.cbWndExtra     = 0;
    wcex.hInstance      = hInstance;
    wcex.hIcon          = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_ANIPUBLICOFFICIALREPORTSELFSERVICECPP));
    wcex.hCursor        = LoadCursor(nullptr, IDC_ARROW);
    wcex.hbrBackground  = (HBRUSH)(COLOR_WINDOW+1);
    wcex.lpszMenuName   = MAKEINTRESOURCEW(IDC_ANIPUBLICOFFICIALREPORTSELFSERVICECPP);
    wcex.lpszClassName  = szWindowClass;
    wcex.hIconSm        = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));

    return RegisterClassExW(&wcex);
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//
//   PURPOSE: Saves instance handle and creates main window
//
//   COMMENTS:
//
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow)
{
   hInst = hInstance; // Store instance handle in our global variable

   HWND hWnd = CreateWindowW(szWindowClass, szTitle, WS_OVERLAPPEDWINDOW,
      CW_USEDEFAULT, 0, CW_USEDEFAULT, 0, nullptr, nullptr, hInstance, nullptr);

   if (!hWnd)
   {
      return FALSE;
   }

   ShowWindow(hWnd, nCmdShow);
   UpdateWindow(hWnd);

   return TRUE;
}

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//
//  PURPOSE: Processes messages for the main window.
//
//  WM_COMMAND  - process the application menu
//  WM_PAINT    - Paint the main window
//  WM_DESTROY  - post a quit message and return
//
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    case WM_COMMAND:
        {
            int wmId = LOWORD(wParam);
            // Parse the menu selections:
            switch (wmId)
            {
            case IDM_ABOUT:
                DialogBox(hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), hWnd, About);
                break;
            case IDM_EXIT:
                DestroyWindow(hWnd);
                break;
            default:
                return DefWindowProc(hWnd, message, wParam, lParam);
            }
        }
        break;
    case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            // TODO: Add any drawing code that uses hdc here...
            EndPaint(hWnd, &ps);
        }
        break;
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}

// Message handler for about box.
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
    case WM_INITDIALOG:
        return (INT_PTR)TRUE;

    case WM_COMMAND:
        if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
        {
            EndDialog(hDlg, LOWORD(wParam));
            return (INT_PTR)TRUE;
        }
        break;
    }
    return (INT_PTR)FALSE;
}
*/