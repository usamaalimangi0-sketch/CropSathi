; =========================================================================
; UNIVERSITY MINI PROJECT : 8086 INTEGER PARITY & SIGN ANALYZER
; TARGET ARCHITECTURE     : Intel 8086 Microprocessor
; ENVIRONMENT             : EMU8086 Microprocessor Emulator
; SEMESTER                : 3rd Semester (Computer Architecture & Assembly)
; =========================================================================

.MODEL SMALL
.STACK 100H

.DATA
    ; ---------------------------------------------------------------------
    ; UI Banners & Messages (Terminated with '$' for DOS INT 21H, AH=09H)
    ; 0DH = Carriage Return (CR), 0AH = Line Feed (LF)
    ; ---------------------------------------------------------------------
    BANNER      DB 0DH, 0AH, "==================================================", 0DH, 0AH
                DB "    EMU8086: NUMBER SIGN & PARITY ANALYZER        ", 0DH, 0AH
                DB "==================================================", 0DH, 0AH, "$"

    PROMPT      DB 0DH, 0AH, "Enter an integer (e.g., -42, 17, 0): $"

    MSG_SIGN_P  DB 0DH, 0AH, " -> Sign   : POSITIVE (+)$"
    MSG_SIGN_N  DB 0DH, 0AH, " -> Sign   : NEGATIVE (-)$"
    MSG_SIGN_Z  DB 0DH, 0AH, " -> Sign   : ZERO (Neither Positive nor Negative)$"

    MSG_EVEN    DB 0DH, 0AH, " -> Parity : EVEN", 0DH, 0AH, "$"
    MSG_ODD     DB 0DH, 0AH, " -> Parity : ODD", 0DH, 0AH, "$"

    MSG_ERR     DB 0DH, 0AH, "[Error] Invalid input! Please enter digits only.", 0DH, 0AH, "$"

    MSG_AGAIN   DB 0DH, 0AH, "Do you want to test another number? (Y/N): $"
    MSG_BYE     DB 0DH, 0AH, 0DH, 0AH, "Program terminated. Thank you!$"

    ; ---------------------------------------------------------------------
    ; Variables
    ; ---------------------------------------------------------------------
    NUM         DW 0        ; Stores the absolute magnitude of the number
    IS_NEG      DB 0        ; Sign tracker: 1 if negative (-), 0 if positive (+)
    HAS_DIGIT   DB 0        ; Flag: 1 if at least one numeric digit was entered

.CODE
MAIN PROC
    ; 1. Initialize the Data Segment register (DS)
    MOV AX, @DATA
    MOV DS, AX

    ; 2. Display the Title Banner
    LEA DX, BANNER
    MOV AH, 09H
    INT 21H

PROGRAM_LOOP:
    ; Reset program variables for each new iteration
    MOV NUM, 0
    MOV IS_NEG, 0
    MOV HAS_DIGIT, 0

    ; Prompt the user to enter a number
    LEA DX, PROMPT
    MOV AH, 09H
    INT 21H

    ; ---------------------------------------------------------------------
    ; Step 1: Read the First Character (handles optional '-' or '+')
    ; ---------------------------------------------------------------------
    MOV AH, 01H             ; DOS Function 01H: Read char from STDIN with echo
    INT 21H

    ; Check if user pressed Enter immediately without typing anything
    CMP AL, 0DH
    JE HANDLE_ERROR

    ; Check if the first character is a minus sign '-'
    CMP AL, '-'
    JNE CHECK_PLUS_SIGN
    MOV IS_NEG, 1           ; Mark as negative
    JMP READ_REST_OF_DIGITS

CHECK_PLUS_SIGN:
    ; Check if the first character is a plus sign '+'
    CMP AL, '+'
    JE READ_REST_OF_DIGITS  ; Skip '+' sign and read digits

    ; If not '+' or '-', verify if it is an ASCII digit ('0' to '9')
    CMP AL, '0'
    JB HANDLE_ERROR
    CMP AL, '9'
    JA HANDLE_ERROR

    ; Valid first digit entered
    MOV HAS_DIGIT, 1
    SUB AL, '0'             ; Convert ASCII character to numeric value (e.g. '5' -> 5)
    MOV AH, 0
    MOV NUM, AX             ; Store first digit in NUM
    JMP READ_REST_OF_DIGITS

    ; ---------------------------------------------------------------------
    ; Step 2: Read Remaining Digits until Enter (0DH) is pressed
    ; ---------------------------------------------------------------------
READ_REST_OF_DIGITS:
    MOV AH, 01H             ; Read next character
    INT 21H

    ; If Enter key (Carriage Return = 0DH) is pressed, finish input
    CMP AL, 0DH
    JE FINISH_INPUT

    ; Check if the character is a valid digit
    CMP AL, '0'
    JB HANDLE_ERROR
    CMP AL, '9'
    JA HANDLE_ERROR

    ; Valid digit: convert from ASCII to integer
    MOV HAS_DIGIT, 1
    SUB AL, '0'             ; AL = numerical digit (0 - 9)
    MOV AH, 0
    PUSH AX                 ; Save new digit on stack

    ; Formula: NUM = (NUM * 10) + new_digit
    MOV AX, NUM
    MOV BX, 10
    MUL BX                  ; AX = NUM * 10
    POP BX                  ; Retrieve the new digit from stack
    ADD AX, BX              ; AX = (NUM * 10) + new_digit
    MOV NUM, AX             ; Save updated result into NUM

    JMP READ_REST_OF_DIGITS

FINISH_INPUT:
    ; If user entered only '+' or '-' without any digits, it's invalid
    CMP HAS_DIGIT, 0
    JE HANDLE_ERROR

    ; ---------------------------------------------------------------------
    ; Step 3: Check Sign (Zero, Positive, or Negative)
    ; ---------------------------------------------------------------------
    CMP NUM, 0
    JNE CHECK_POSITIVE_NEGATIVE

    ; Number is 0 (Zero)
    LEA DX, MSG_SIGN_Z
    MOV AH, 09H
    INT 21H
    JMP EVALUATE_PARITY

CHECK_POSITIVE_NEGATIVE:
    CMP IS_NEG, 1
    JE PRINT_NEGATIVE

    ; Number is Positive
    LEA DX, MSG_SIGN_P
    MOV AH, 09H
    INT 21H
    JMP EVALUATE_PARITY

PRINT_NEGATIVE:
    ; Number is Negative
    LEA DX, MSG_SIGN_N
    MOV AH, 09H
    INT 21H

    ; ---------------------------------------------------------------------
    ; Step 4: Check Parity (Even or Odd)
    ; In binary, the least significant bit (bit 0) determines parity:
    ;   - If bit 0 is 0 -> The number is EVEN
    ;   - If bit 0 is 1 -> The number is ODD
    ; TEST AX, 1 performs bitwise AND without modifying AX:
    ;   - If bit 0 is 0: Result is 0 -> Zero Flag (ZF) = 1
    ;   - If bit 0 is 1: Result is 1 -> Zero Flag (ZF) = 0
    ; ---------------------------------------------------------------------
EVALUATE_PARITY:
    MOV AX, NUM
    TEST AX, 1
    JNZ PRINT_ODD           ; If ZF == 0 (bit 0 was 1), number is Odd

    ; Number is Even (ZF == 1)
    LEA DX, MSG_EVEN
    MOV AH, 09H
    INT 21H
    JMP ASK_RETRY

PRINT_ODD:
    ; Number is Odd
    LEA DX, MSG_ODD
    MOV AH, 09H
    INT 21H

    ; ---------------------------------------------------------------------
    ; Step 5: Ask if user wants to test another number
    ; ---------------------------------------------------------------------
ASK_RETRY:
    LEA DX, MSG_AGAIN
    MOV AH, 09H
    INT 21H

    MOV AH, 01H             ; Read user response
    INT 21H

    ; If 'Y' or 'y', loop back to the beginning
    CMP AL, 'Y'
    JE PROGRAM_LOOP
    CMP AL, 'y'
    JE PROGRAM_LOOP

    ; Exit routine
    LEA DX, MSG_BYE
    MOV AH, 09H
    INT 21H

    ; DOS Function 4CH: Terminate process safely
    MOV AH, 4CH
    INT 21H

    ; ---------------------------------------------------------------------
    ; Error Handler: Displays error message and restarts input loop
    ; ---------------------------------------------------------------------
HANDLE_ERROR:
    LEA DX, MSG_ERR
    MOV AH, 09H
    INT 21H
    JMP PROGRAM_LOOP

MAIN ENDP
END MAIN
