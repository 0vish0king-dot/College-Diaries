window.cQuizQuestions = [
  {
    question: 'What does this program print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int value = 5;\n    printf("%d", value + 2);\n    return 0;\n}',
    options: ['5', '7', '52', 'A compilation error'],
    correctAnswer: 1,
    explanation: 'The addition happens before printf runs, so value + 2 is 7.'
  },
  {
    question: 'What is the exact output of this loop?',
    code: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 3; i++) {\n        printf("%d", i);\n    }\n    return 0;\n}',
    options: ['123', '012', '0123', '3'],
    correctAnswer: 1,
    explanation: 'The loop starts at 0 and prints i while it is less than 3, giving 012 with no spaces.'
  },
  {
    question: 'What value is printed from the array?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int numbers[] = {2, 4, 6};\n    printf("%d", numbers[1]);\n    return 0;\n}',
    options: ['2', '4', '6', '1'],
    correctAnswer: 1,
    explanation: 'C arrays use zero-based indexes: numbers[0] is 2 and numbers[1] is 4.'
  },
  {
    question: 'What does this program print?',
    code: '#include <stdio.h>\n\nvoid addOne(int value) {\n    value++;\n}\n\nint main(void) {\n    int number = 3;\n    addOne(number);\n    printf("%d", number);\n    return 0;\n}',
    options: ['3', '4', '0', 'A compilation error'],
    correctAnswer: 0,
    explanation: 'The function receives a copy of number, so incrementing value does not change number in main.'
  },
  {
    question: 'What value does count have when it is printed?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int count = 0;\n    while (count < 3) {\n        count++;\n    }\n    printf("%d", count);\n    return 0;\n}',
    options: ['2', '3', '4', 'The loop never ends'],
    correctAnswer: 1,
    explanation: 'Each loop adds 1. Once count reaches 3, the condition count < 3 is false and the loop stops.'
  },
  {
    question: 'What does integer division print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    printf("%d", 7 / 2);\n    return 0;\n}',
    options: ['3', '3.5', '4', '1'],
    correctAnswer: 0,
    explanation: 'Both operands are integers, so C discards the fractional part and 7 / 2 evaluates to 3.'
  },
  {
    question: 'What is the result of the remainder operator?',
    code: '#include <stdio.h>\n\nint main(void) {\n    printf("%d", 10 % 3);\n    return 0;\n}',
    options: ['0', '1', '3', '3.33'],
    correctAnswer: 1,
    explanation: 'Ten divided by three leaves a remainder of 1.'
  },
  {
    question: 'Which message does this condition print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int temperature = 24;\n    if (temperature > 20) {\n        printf("Warm");\n    } else {\n        printf("Cool");\n    }\n    return 0;\n}',
    options: ['Warm', 'Cool', '24', 'Nothing'],
    correctAnswer: 0,
    explanation: 'Since 24 is greater than 20, the if branch prints Warm.'
  },
  {
    question: 'What character is printed?',
    code: '#include <stdio.h>\n\nint main(void) {\n    char letter = \'B\';\n    printf("%c", letter);\n    return 0;\n}',
    options: ['A', 'B', '66', 'A1'],
    correctAnswer: 1,
    explanation: 'The variable contains the character B, and %c prints its character value.'
  },
  {
    question: 'What does the function return?',
    code: '#include <stdio.h>\n\nint square(int number) {\n    return number * number;\n}\n\nint main(void) {\n    printf("%d", square(5));\n    return 0;\n}',
    options: ['10', '20', '25', '5'],
    correctAnswer: 2,
    explanation: 'square multiplies its argument by itself, so square(5) returns 25.'
  },
  {
    question: 'What value is printed after changing the value through a pointer?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int number = 8;\n    int *pointer = &number;\n    *pointer = 11;\n    printf("%d", number);\n    return 0;\n}',
    options: ['8', '11', 'The address of number', '0'],
    correctAnswer: 1,
    explanation: 'pointer stores the address of number. Assigning 11 through *pointer changes number itself.'
  },
  {
    question: 'What does this string print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    char greeting[] = "Hi";\n    printf("%s", greeting);\n    return 0;\n}',
    options: ['greeting', 'Hi', 'H', 'An empty line'],
    correctAnswer: 1,
    explanation: 'The %s format specifier prints the characters in the string up to its terminating null character.'
  },
  {
    question: 'What is the sum printed by this array loop?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int values[] = {2, 3, 4};\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        total += values[i];\n    }\n    printf("%d", total);\n    return 0;\n}',
    options: ['7', '9', '12', '3'],
    correctAnswer: 1,
    explanation: 'The loop adds all three elements: 2 + 3 + 4 equals 9.'
  },
  {
    question: 'Does this logical condition print "Yes" or "No"?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int first = 2;\n    int second = 5;\n    if (first < 3 && second > 4) {\n        printf("Yes");\n    } else {\n        printf("No");\n    }\n    return 0;\n}',
    options: ['Yes', 'No', '2', '5'],
    correctAnswer: 0,
    explanation: 'Both comparisons are true, and && is true only when both sides are true.'
  },
  {
    question: 'What does this switch statement print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int choice = 2;\n    switch (choice) {\n        case 1: printf("One"); break;\n        case 2: printf("Two"); break;\n        default: printf("Other");\n    }\n    return 0;\n}',
    options: ['One', 'Two', 'Other', 'Nothing'],
    correctAnswer: 1,
    explanation: 'The value of choice matches case 2, which prints Two and then exits the switch.'
  },
  {
    question: 'What sequence does this while loop print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int number = 1;\n    while (number <= 3) {\n        printf("%d", number);\n        number++;\n    }\n    return 0;\n}',
    options: ['012', '123', '1234', '3'],
    correctAnswer: 1,
    explanation: 'The loop prints 1, 2, and 3. It stops when number becomes 4.'
  },
  {
    question: 'How many times does this do-while loop print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int number = 1;\n    do {\n        printf("%d", number);\n        number++;\n    } while (number < 1);\n    return 0;\n}',
    options: ['0 times', '1 time', '2 times', 'It never ends'],
    correctAnswer: 1,
    explanation: 'A do-while loop runs its body before checking the condition, so it prints once even though the condition is false.'
  },
  {
    question: 'What does this loop print when it skips 2?',
    code: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 3; i++) {\n        if (i == 2) continue;\n        printf("%d", i);\n    }\n    return 0;\n}',
    options: ['123', '13', '23', '12'],
    correctAnswer: 1,
    explanation: 'When i is 2, continue skips printf for that iteration. The loop prints 1 and 3.'
  },
  {
    question: 'What sequence is printed before the loop stops?',
    code: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 4; i++) {\n        if (i == 3) break;\n        printf("%d", i);\n    }\n    return 0;\n}',
    options: ['1234', '12', '34', '1'],
    correctAnswer: 1,
    explanation: 'When i reaches 3, break exits the loop before that value is printed.'
  },
  {
    question: 'What does strlen report for this string?',
    code: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char word[] = "code";\n    printf("%zu", strlen(word));\n    return 0;\n}',
    options: ['3', '4', '5', 'The size of a pointer'],
    correctAnswer: 1,
    explanation: 'strlen counts the characters before the terminating null character. "code" has four characters.'
  },
  {
    question: 'Which character does this array access print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    char word[] = "code";\n    printf("%c", word[1]);\n    return 0;\n}',
    options: ['c', 'o', 'd', '1'],
    correctAnswer: 1,
    explanation: 'String and array indexes start at zero, so word[1] is the second character, o.'
  },
  {
    question: 'What value is stored in the uninitialized array element?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int values[3] = {4};\n    printf("%d", values[1]);\n    return 0;\n}',
    options: ['4', '1', '0', 'An indeterminate value'],
    correctAnswer: 2,
    explanation: 'When an array is initialized with fewer values than its size, the remaining elements are initialized to zero.'
  },
  {
    question: 'What does this comparison print?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int left = 5;\n    int right = 5;\n    printf("%d", left == right);\n    return 0;\n}',
    options: ['0', '1', '5', 'true'],
    correctAnswer: 1,
    explanation: 'The equality comparison is true. In C, a true relational expression has the integer value 1.'
  },
  {
    question: 'Which word does the conditional operator choose?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int number = 6;\n    printf("%s", number % 2 == 0 ? "Even" : "Odd");\n    return 0;\n}',
    options: ['Even', 'Odd', '6', 'Nothing'],
    correctAnswer: 0,
    explanation: 'Six divided by two has no remainder, so the condition is true and the operator chooses Even.'
  },
  {
    question: 'What is printed after the prefix increment?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int number = 4;\n    ++number;\n    printf("%d", number);\n    return 0;\n}',
    options: ['3', '4', '5', '44'],
    correctAnswer: 2,
    explanation: 'The prefix increment increases number by one before the next statement, making it 5.'
  },
  {
    question: 'What value is selected from this two-dimensional array?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int grid[2][2] = {{1, 2}, {3, 4}};\n    printf("%d", grid[1][0]);\n    return 0;\n}',
    options: ['1', '2', '3', '4'],
    correctAnswer: 2,
    explanation: 'grid[1] selects the second row, and [0] selects its first element, which is 3.'
  },
  {
    question: 'What does max return for these arguments?',
    code: '#include <stdio.h>\n\nint max(int first, int second) {\n    if (first > second) return first;\n    return second;\n}\n\nint main(void) {\n    printf("%d", max(4, 9));\n    return 0;\n}',
    options: ['4', '9', '13', '0'],
    correctAnswer: 1,
    explanation: 'Since 4 is not greater than 9, the function returns its second argument, 9.'
  },
  {
    question: 'What value is printed for this named constant?',
    code: '#include <stdio.h>\n#define LIMIT 4\n\nint main(void) {\n    printf("%d", LIMIT);\n    return 0;\n}',
    options: ['LIMIT', '0', '4', 'A compilation error'],
    correctAnswer: 2,
    explanation: 'Before compilation, the preprocessor replaces LIMIT with 4.'
  },
  {
    question: 'What is the result of this arithmetic expression?',
    code: '#include <stdio.h>\n\nint main(void) {\n    printf("%d", 2 + 3 * 4);\n    return 0;\n}',
    options: ['20', '14', '24', '14.0'],
    correctAnswer: 1,
    explanation: 'Multiplication has higher precedence than addition: 3 * 4 is 12, then 2 + 12 is 14.'
  },
  {
    question: 'How many elements are in this array?',
    code: '#include <stdio.h>\n\nint main(void) {\n    int values[] = {7, 8, 9};\n    size_t count = sizeof(values) / sizeof(values[0]);\n    printf("%zu", count);\n    return 0;\n}',
    options: ['2', '3', '4', 'The number of bytes in an int'],
    correctAnswer: 1,
    explanation: 'The total array size divided by the size of one element gives the number of elements: 3.'
  }
];
