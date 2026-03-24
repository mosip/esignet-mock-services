# Use a recent Go version that supports go 1.25 requirement
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go.mod (and go.sum if it exists)
COPY go.mod ./

# Download dependencies (now safe because Go version matches)
RUN go mod download

# Copy source code
COPY main.go .

# Build the binary
RUN go build -o main .

# Final minimal image
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

# Expose the port your app listens on
EXPOSE 8080

CMD ["./main"]