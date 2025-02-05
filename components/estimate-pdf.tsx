/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/alt-text */
//@ts-nocheck
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Estimate } from "@/types";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottom: "1 solid #e0e0e0",
    paddingBottom: 10,
  },
  leftHeader: {
    flexDirection: "column",
  },
  rightHeader: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    width: 90,
    height: 90,
    objectFit: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 5,
    color: "#1a237e",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 5,
    color: "#3f51b5",
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
  },
  clientInfo: {
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  itemCol: {
    width: "59%",
  },
  quantityCol: {
    width: "7%",
  },
  unitCol: {
    width: "7%",
  },
  priceCol: {
    width: "10%",
  },
  taxPercentCol: {
    width: "7%",
  },
  totalCol: {
    width: "10%",
    textAlign: "right",
  },
  tableCell: {
    fontSize: 10,
  },
  total: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: 700,
    color: "#1a237e",
  },
  paymentDetails: {
    fontSize: 10,
    marginBottom: 3,
    borderBottom: "1 solid #e0e0e0",
  },
  paymentInfo: {
    marginTop: 30,
    borderTop: "1 solid #e0e0e0",
    paddingTop: 10,
  },
  bankDetails: {
    marginTop: 10,
    border: "1 solid #e0e0e0",
    padding: 10,
    borderRadius: 4,
    alignSelf: "flex-start",
    maxWidth: "60%",
  },
  signature: {
    marginTop: 50,
    borderTop: "1 solid #000000",
    width: 200,
    textAlign: "center",
    fontSize: 10,
    alignSelf: "flex-end",
  },
});

export function EstimatePDF({ estimate }: { estimate: Estimate }) {
  const subtotal =
    estimate.items?.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    ) || 0;
  const taxTotal =
    estimate.items?.reduce(
      (sum, item) =>
        sum +
        item.quantity * item.product.price * (item.product.taxPercent / 100),
      0
    ) || 0;
  const total = subtotal + taxTotal;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            {estimate.business?.logoUrl && (
              <Image style={styles.logo} src={estimate.business.logoUrl} />
            )}

            <Text style={styles.text}>{estimate.business?.name}</Text>
            <Text style={styles.text}>{estimate.business?.address}</Text>
            <Text style={styles.text}>{estimate.business?.email}</Text>
            <Text style={styles.text}>{estimate.business?.phone}</Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.title}>Estimate</Text>
            <Text style={styles.subtitle}>#{estimate.number}</Text>
            <Text style={styles.text}>
              Date:{" "}
              {new Date(estimate.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.text}>
              Expiry Date:{" "}
              {new Date(estimate.expiryDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.subtitle}>Estimate For</Text>
          <Text style={styles.text}>{estimate.clientName}</Text>
          <Text style={styles.text}>{estimate.clientEmail}</Text>
          {estimate.clientAddress && (
            <Text style={styles.text}>{estimate.clientAddress}</Text>
          )}
          {estimate.additionalAddress && (
            <Text style={styles.text}>{estimate.additionalAddress}</Text>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.itemCol]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Item</Text>
            </View>
            <View style={[styles.tableColHeader, styles.quantityCol]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Qty</Text>
            </View>
            <View style={[styles.tableColHeader, styles.unitCol]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Unit</Text>
            </View>
            <View style={[styles.tableColHeader, styles.priceCol]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Price</Text>
            </View>
            <View style={[styles.tableColHeader, styles.taxPercentCol]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Tax %</Text>
            </View>
            <View style={[styles.tableColHeader, styles.totalCol]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Total</Text>
            </View>
          </View>

          {estimate.items?.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={[styles.tableCol, styles.itemCol]}>
                <Text style={styles.tableCell}>{item.product.name}</Text>
              </View>
              <View style={[styles.tableCol, styles.quantityCol]}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, styles.unitCol]}>
                <Text style={styles.tableCell}>{item.product.unit}</Text>
              </View>
              <View style={[styles.tableCol, styles.priceCol]}>
                <Text style={styles.tableCell}>
                  ₹{item.product.price.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.taxPercentCol]}>
                <Text style={styles.tableCell}>{item.product.taxPercent}%</Text>
              </View>
              <View style={[styles.tableCol, styles.totalCol]}>
                <Text style={styles.tableCell}>
                  ₹
                  {(
                    item.quantity *
                    item.product.price *
                    (1 + item.product.taxPercent / 100)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Subtotal (Rs): {subtotal.toFixed(2)}</Text>
          <Text>Tax Total (Rs): {taxTotal.toFixed(2)}</Text>
          <Text style={{ fontWeight: 700 }}>
            Total (Rs): {total.toFixed(2)}
          </Text>
        </View>

        <View style={styles.signature}>
          <Text>Authorized Signature</Text>
        </View>
      </Page>
    </Document>
  );
}
